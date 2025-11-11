import { S3Client } from "@aws-sdk/client-s3";

const HETZNER_ACCESS_KEY_ID = process.env.HETZNER_ACCESS_KEY_ID || "";
const HETZNER_SECRET_ACCESS_KEY = process.env.HETZNER_SECRET_ACCESS_KEY || "";
const HETZNER_REGION = process.env.HETZNER_REGION || "eu-central-1";
const HETZNER_ENDPOINT = process.env.HETZNER_ENDPOINT || "";

if (!HETZNER_ACCESS_KEY_ID || !HETZNER_SECRET_ACCESS_KEY) {
  console.warn(
    "Hetzner Object Storage credentials not configured. Set HETZNER_ACCESS_KEY_ID and HETZNER_SECRET_ACCESS_KEY."
  );
}

/**
 * S3-compatible client for Hetzner Object Storage
 * Works with any S3-compatible storage provider
 */
export const storageClient = new S3Client({
  region: HETZNER_REGION,
  endpoint: HETZNER_ENDPOINT,
  credentials: {
    accessKeyId: HETZNER_ACCESS_KEY_ID,
    secretAccessKey: HETZNER_SECRET_ACCESS_KEY,
  },
  // Force path style for S3-compatible services
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.HETZNER_BUCKET_NAME || "";

if (!BUCKET_NAME) {
  console.warn("HETZNER_BUCKET_NAME not set in environment variables.");
}
