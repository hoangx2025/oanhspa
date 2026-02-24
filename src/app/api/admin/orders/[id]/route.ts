import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type Params = { params: { id: string } };

function authCheck(session: import("next-auth").Session | null): boolean {
  return !session || session.user.role !== "Admin";
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const order = await db.order.findUnique({
    where: { id: Number(params.id) },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, handle: true, category: { select: { name: true } } } },
        },
      },
    },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { platform, externalId, orderedAt, status, note, items = [] } = await req.json();
  const orderId = Number(params.id);

  const order = await db.$transaction(async (tx: Prisma.TransactionClient) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        platform, externalId: externalId || null,
        orderedAt: orderedAt ? new Date(orderedAt) : undefined,
        status: status || "completed",
        note: note || null,
      },
    });

    await tx.orderItem.deleteMany({ where: { orderId } });
    for (const item of items as { productId: number; variantId?: number; quantity: number; price: number }[]) {
      await tx.orderItem.create({
        data: {
          orderId,
          productId: Number(item.productId),
          variantId: item.variantId ? Number(item.variantId) : null,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        },
      });
    }

    return updated;
  });

  return NextResponse.json(order);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (authCheck(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.order.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
