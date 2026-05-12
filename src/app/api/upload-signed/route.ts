import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/upload-signed
 * Generates a signed upload URL for Supabase Storage.
 * The client uploads directly to Supabase, bypassing Vercel's 4.5MB body limit.
 *
 * Body: { folder: string, fileName: string, contentType: string }
 * Returns: { signedUrl: string, publicUrl: string, path: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { folder, fileName, contentType } = body as {
      folder: string;
      fileName: string;
      contentType: string;
    };

    if (!folder || !fileName) {
      return NextResponse.json(
        { error: "folder and fileName are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 500 }
      );
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b: { name: string }) => b.name === "uploads");

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket("uploads", {
        public: true,
        fileSizeLimit: "50MB",
      });
      if (createError) {
        console.error("Failed to create bucket:", createError);
      }
    }

    // Determine file extension from contentType
    const ext =
      contentType
        ?.split("/")[1]
        ?.replace("jpeg", "jpg")
        ?.replace("mpeg", "mp3")
        ?.replace("x-wav", "wav")
        ?.replace("ogg", "ogg") || "bin";

    const filePath = `${folder}/${fileName}.${ext}`;

    // Create signed upload URL
    const { data, error } = await supabase.storage
      .from("uploads")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Failed to create signed URL:", error);
      return NextResponse.json(
        { error: "Failed to create upload URL" },
        { status: 500 }
      );
    }

    // Get public URL (available after upload completes)
    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      publicUrl: urlData.publicUrl,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create upload URL";
    console.error("Upload URL API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
