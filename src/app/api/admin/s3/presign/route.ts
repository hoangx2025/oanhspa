import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// AWS S3 max presigned URL expiry = 7 days (604800s)
// Custom S3-compatible (MinIO, etc.) supports up to 10 years (315360000s)
const AWS_MAX_EXPIRY = 604800;
const CUSTOM_MAX_EXPIRY = 315360000; // ~10 years

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session as import("next-auth").Session).user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const mimeType = searchParams.get("mimeType") ?? "application/octet-stream";

  if (!filename) return NextResponse.json({ error: "filename required" }, { status: 400 });

  const config = await db.s3Config.findFirst({ where: { isDefault: true } });
  if (!config) return NextResponse.json({ error: "No default S3 config" }, { status: 400 });

  const isCustomEndpoint = !!config.endpoint;
  const getExpiresIn = isCustomEndpoint ? CUSTOM_MAX_EXPIRY : AWS_MAX_EXPIRY;

  const s3 = new S3Client({
    region: config.region,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: true } : {}),
  });

  const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  // Presigned PUT URL for upload (1 hour)
  const putCommand = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: mimeType,
  });
  const uploadUrl = await getSignedUrl(s3, putCommand, { expiresIn: 3600 });

  // Presigned GET URL for reading (max available expiry)
  const getCommand = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
  });
  const presignedGetUrl = await getSignedUrl(s3, getCommand, { expiresIn: getExpiresIn });
  const presignedExpiry = new Date(Date.now() + getExpiresIn * 1000);

  // Stable permanent URL (used as unique key in DB)
  const permanentUrl = isCustomEndpoint
    ? `${config.endpoint}/${config.bucket}/${key}`
    : `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl: permanentUrl, key, presignedGetUrl, presignedExpiry });
}
