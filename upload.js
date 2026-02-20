import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const r2AccountId = "ffc2e4220189c8652dd5a9d1aa442da3";
const r2AccessKeyId = "24f9ae67c9ea90f7171ab704d2c174d6";
const r2SecretAccessKey = "347b6ec9c17f0a496f6c1b743a542409fc001a9b8dc6e5eed1dadb8d355fb150";
const r2BucketName = "data";

const r2Endpoint = `https://${r2AccountId}.r2.cloudflarestorage.com`;

const client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey
  }
});

// ✅ prefix is passed at call time
export async function upload(filePath, prefix) {
  console.log(`Reading local file: ${filePath}`);

  const body = fs.readFileSync(filePath);
  const remoteKey = `${prefix}/${path.basename(filePath)}`;

  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: remoteKey,
    Body: body,
    ContentType: "text/csv"
  });

  console.log(`Uploading to R2 as: ${remoteKey}`);
  await client.send(command);
  console.log(`Upload complete for ${remoteKey}\n`);
}