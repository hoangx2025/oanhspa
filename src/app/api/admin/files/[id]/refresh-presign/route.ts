import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const AWS_MAX_EXPIRY = 604800;      // 7 days
const CUSTOM_MAX_EXPIRY = 315360000; // ~10 years

type Params = { params: { id: string } };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = await db.file.findUnique({ where: { id: Number(params.id) } });
  if (!file) return NextResponse.json({ error: "File not found" }, { status: 404 });
  if (!file.key) return NextResponse.json({ error: "No S3 key stored for this file" }, { status: 400 });

  const config = await db.s3Config.findFirst({ where: { isDefault: true } });
  if (!config) return NextResponse.json({ error: "No default S3 config" }, { status: 400 });

  const isCustomEndpoint = !!config.endpoint;
  const getExpiresIn = isCustomEndpoint ? CUSTOM_MAX_EXPIRY : AWS_MAX_EXPIRY;

  const s3 = new S3Client({
    region: config.region,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: true } : {}),
  });

  const command = new GetObjectCommand({ Bucket: config.bucket, Key: file.key });
  const presignedUrl = await getSignedUrl(s3, command, { expiresIn: getExpiresIn });
  const presignedExpiry = new Date(Date.now() + getExpiresIn * 1000);

  const updated = await db.file.update({
    where: { id: file.id },
    data: { presignedUrl, presignedExpiry },
  });

  return NextResponse.json({ presignedUrl: updated.presignedUrl, presignedExpiry: updated.presignedExpiry });
}
