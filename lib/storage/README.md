# Hetzner Object Storage Integration

## Setup

### 1. Configure Environment Variables

Add to `.env.local`:

```env
HETZNER_ACCESS_KEY_ID=your-access-key
HETZNER_SECRET_ACCESS_KEY=your-secret-key
HETZNER_BUCKET_NAME=your-bucket-name
HETZNER_REGION=eu-central-1
HETZNER_ENDPOINT=https://fsn1.your-objectstorage.com
```

### 2. Create a Bucket

Create a bucket in your Hetzner Object Storage console before using these utilities.

## Usage Examples

### Upload a File

```typescript
import { uploadFile } from "@/lib/storage/utils";

const file = await fetch("/path/to/file").then((r) => r.arrayBuffer());

const result = await uploadFile({
  key: "uploads/my-file.pdf",
  body: Buffer.from(file),
  contentType: "application/pdf",
  metadata: {
    uploadedBy: "user-123",
    originalName: "document.pdf",
  },
});

console.log("Uploaded to:", result.url);
```

### Get a Pre-signed URL

```typescript
import { getFileUrl } from "@/lib/storage/utils";

// URL expires in 1 hour by default
const url = await getFileUrl("uploads/my-file.pdf");

// Custom expiration (24 hours)
const urlLong = await getFileUrl("uploads/my-file.pdf", 86400);
```

### Download a File

```typescript
import { downloadFile } from "@/lib/storage/utils";

const stream = await downloadFile("uploads/my-file.pdf");

// Convert to Response
return new Response(stream, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": 'attachment; filename="my-file.pdf"',
  },
});
```

### Delete a File

```typescript
import { deleteFile } from "@/lib/storage/utils";

await deleteFile("uploads/my-file.pdf");
```

### List Files

```typescript
import { listFiles } from "@/lib/storage/utils";

// List all files
const allFiles = await listFiles();

// List files with prefix
const uploadFiles = await listFiles("uploads/");

// Limit results
const recentFiles = await listFiles("uploads/", 10);
```

### Check if File Exists

```typescript
import { fileExists } from "@/lib/storage/utils";

const exists = await fileExists("uploads/my-file.pdf");
if (exists) {
  console.log("File exists!");
}
```

### Get File Metadata

```typescript
import { getFileMetadata } from "@/lib/storage/utils";

const metadata = await getFileMetadata("uploads/my-file.pdf");
console.log("Size:", metadata.contentLength);
console.log("Type:", metadata.contentType);
console.log("Modified:", metadata.lastModified);
```

## API Route Example

See `app/api/upload/route.ts` for a complete file upload API example.

## S3-Compatible Storage

These utilities work with any S3-compatible storage provider. To use a different provider:

1. Update environment variables with your provider's endpoint
2. Adjust the region if needed
3. The code will work without modifications
