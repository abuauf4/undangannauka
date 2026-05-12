import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/storage/[path]
 * Serve a file from PostgreSQL database storage.
 *
 * The path parameter is the file's storage path (URL-decoded).
 * Returns the binary file with appropriate Content-Type header.
 * Supports caching via If-None-Match / ETag.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path: encodedPath } = await params;
    const filePath = decodeURIComponent(encodedPath);

    const storageFile = await db.storageFile.findUnique({
      where: { path: filePath },
      select: {
        id: true,
        mimeType: true,
        size: true,
        data: true,
        createdAt: true,
      },
    });

    if (!storageFile || !storageFile.data) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // ETag for caching (use file ID + size as unique identifier)
    const etag = `"${storageFile.id}-${storageFile.size}"`;
    const ifNoneMatch = req.headers.get("If-None-Match");
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    // Convert Buffer to Uint8Array for response
    const uint8Array = new Uint8Array(storageFile.data);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": storageFile.mimeType,
        "Content-Length": String(storageFile.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": etag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "File retrieval failed";
    console.error("Storage retrieval error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
