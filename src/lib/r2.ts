import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME || "";
  const publicUrl = process.env.R2_PUBLIC_URL || "";

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await r2.send(command);

  return `${publicUrl}/${fileName}`;
}

export async function deleteFromR2(fileName: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME || "";

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });

  await r2.send(command);
}
