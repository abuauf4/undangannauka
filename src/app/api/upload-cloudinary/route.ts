import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/upload-cloudinary
 * Upload a file to Cloudinary (PRIMARY storage).
 *
 * Accepts FormData with:
 * - file: File (binary)
 * - folder: string (Cloudinary folder, e.g. "inv-123")
 * - name: string (public_id for the file, e.g. "photo-pria")
 *
 * Returns: { url: string, publicId: string, stored: "cloudinary" }
 *
 * Cloudinary Free Tier:
 * - 25 GB storage
 * - 25 GB bandwidth/month
 * - Auto image optimization & transformation
 */
export async function POST(req: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const name = formData.get("name") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!folder || !name) {
      return NextResponse.json(
        { error: "folder and name required" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    const base64Data = bytes.toString("base64");
    const mimeType = file.type || "application/octet-stream";
    const dataUri = `data:${mimeType};base64,${base64Data}`;

    // Determine resource type (image, video, or raw for audio)
    let resourceType = "raw"; // default for audio/misc
    if (mimeType.startsWith("image/")) {
      resourceType = "image";
    } else if (mimeType.startsWith("video/") || mimeType.startsWith("audio/")) {
      resourceType = "video"; // Cloudinary uses "video" for audio files too
    }

    // Upload to Cloudinary via their REST API
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${folder}/${name}`;

    // Generate signature
    const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await generateSha1Hex(signatureString);

    const uploadFormData = new FormData();
    uploadFormData.append("file", dataUri);
    uploadFormData.append("folder", folder);
    uploadFormData.append("public_id", publicId);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("signature", signature);
    uploadFormData.append("overwrite", "true");
    uploadFormData.append("resource_type", resourceType);

    // Upload directly to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Cloudinary upload error:", errText);
      return NextResponse.json(
        { error: "Cloudinary upload gagal" },
        { status: 500 }
      );
    }

    const result = (await uploadRes.json()) as {
      secure_url: string;
      public_id: string;
      bytes: number;
      width?: number;
      height?: number;
      duration?: number;
    };

    console.log(`Uploaded ${name} to Cloudinary: ${result.secure_url} (${(result.bytes / 1024).toFixed(0)}KB)`);

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      stored: "cloudinary",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload gagal";
    console.error("Cloudinary upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Generate SHA-1 hex digest for Cloudinary signature.
 * Uses Web Crypto API (available in Node.js 18+ and edge runtime).
 */
async function generateSha1Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
