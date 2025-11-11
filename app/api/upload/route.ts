import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${timestamp}-${sanitizedName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to storage
    const result = await uploadFile({
      key,
      body: buffer,
      contentType: file.type,
      metadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        file: {
          key: result.key,
          url: result.url,
          name: file.name,
          size: file.size,
          type: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve file metadata
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "No key provided" }, { status: 400 });
  }

  try {
    const { getFileMetadata, getFileUrl } = await import("@/lib/storage/utils");

    const [metadata, url] = await Promise.all([
      getFileMetadata(key),
      getFileUrl(key, 3600), // 1 hour expiration
    ]);

    return NextResponse.json({
      key,
      url,
      metadata,
    });
  } catch (error) {
    console.error("Get file error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
