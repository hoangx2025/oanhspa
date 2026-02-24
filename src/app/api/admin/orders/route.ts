import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const platform = searchParams.get("platform") ?? "";
  const limit = 20;

  const where = platform ? { platform } : {};
  const [total, items] = await Promise.all([
    db.order.count({ where }),
    db.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { orderedAt: "desc" },
      include: {
        items: {
          include: { product: { select: { id: true, title: true, handle: true } } },
        },
      },
    }),
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { platform, externalId, orderedAt, status, note, items = [] } = await req.json();

  const order = await db.$transaction(async (tx: import("@prisma/client").Prisma.TransactionClient) => {
    const created = await tx.order.create({
      data: {
        platform, externalId: externalId || null,
        orderedAt: orderedAt ? new Date(orderedAt) : new Date(),
        status: status || "completed",
        note: note || null,
      },
    });

    for (const item of items as { productId: number; variantId?: number; quantity: number; price: number }[]) {
      await tx.orderItem.create({
        data: {
          orderId: created.id,
          productId: Number(item.productId),
          variantId: item.variantId ? Number(item.variantId) : null,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        },
      });
    }

    return created;
  });

  return NextResponse.json(order, { status: 201 });
}
