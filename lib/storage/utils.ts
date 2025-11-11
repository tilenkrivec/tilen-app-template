import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { storageClient, BUCKET_NAME } from "./client";

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | ReadableStream;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Upload a file to Hetzner Object Storage
 * @param options Upload configuration
 * @returns Upload result with key and URL
 */
export async function uploadFile(
  options: UploadOptions
): Promise<UploadResult> {
  const { key, body, contentType, metadata } = options;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  await storageClient.send(command);

  return {
    key,
    url: `${process.env.HETZNER_ENDPOINT}/${BUCKET_NAME}/${key}`,
    bucket: BUCKET_NAME,
  };
}

/**
 * Get a pre-signed URL for secure file access
 * @param key Object key
 * @param expiresIn Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Pre-signed URL
 */
export async function getFileUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(storageClient, command, { expiresIn });
}

/**
 * Download a file from storage
 * @param key Object key
 * @returns File stream
 */
export async function downloadFile(key: string): Promise<ReadableStream> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await storageClient.send(command);

  if (!response.Body) {
    throw new Error("File not found or empty");
  }

  return response.Body.transformToWebStream();
}

/**
 * Delete a file from storage
 * @param key Object key
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await storageClient.send(command);
}

/**
 * List files in a bucket with optional prefix
 * @param prefix Optional prefix to filter files
 * @param maxKeys Maximum number of keys to return (default: 1000)
 * @returns List of file keys
 */
export async function listFiles(
  prefix?: string,
  maxKeys: number = 1000
): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix,
    MaxKeys: maxKeys,
  });

  const response = await storageClient.send(command);

  return response.Contents?.map((item) => item.Key || "") || [];
}

/**
 * Check if a file exists in storage
 * @param key Object key
 * @returns True if file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await storageClient.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get file metadata
 * @param key Object key
 * @returns File metadata
 */
export async function getFileMetadata(key: string): Promise<{
  contentType?: string;
  contentLength?: number;
  lastModified?: Date;
  metadata?: Record<string, string>;
}> {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const response = await storageClient.send(command);

  return {
    contentType: response.ContentType,
    contentLength: response.ContentLength,
    lastModified: response.LastModified,
    metadata: response.Metadata,
  };
}
