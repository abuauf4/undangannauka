/**
 * Client-side upload helpers — Cloudinary (primary) + Database (fallback).
 *
 * Architecture:
 * 1. Client compresses the file (image/audio) in the browser
 * 2. Client uploads to /api/upload-cloudinary → Cloudinary CDN
 * 3. If Cloudinary fails, falls back to Supabase Storage (signed URL)
 * 4. If Supabase fails, falls back to database storage
 * 5. Last resort: base64 data URL
 *
 * Upload chain: Cloudinary → Supabase Storage → Database storage → Base64
 *
 * Cloudinary Free Tier:
 * - Storage: 25GB (files)
 * - Bandwidth: 25GB/month
 * - Auto image optimization & transformation
 * - Estimated capacity: ~5000+ invitations with photos & music
 */

// ─── Size Limits ───

/** Maximum file size for database storage fallback (4MB to stay under Vercel's 4.5MB body limit) */
const MAX_DB_UPLOAD_SIZE = 4 * 1024 * 1024; // 4MB

/** Maximum audio file size (before compression) */
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15MB raw, will be compressed

/** Maximum file size for Cloudinary upload (25MB — Cloudinary limit is higher but we cap it) */
const MAX_CLOUDINARY_UPLOAD_SIZE = 25 * 1024 * 1024; // 25MB

// ─── Image Compression ───

/**
 * Compress an image File using Canvas API and return a Blob (JPEG).
 * Automatically reduces quality if the result is too large.
 */
export async function compressImageFile(
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> {
  const compress = (q: number, mw: number): Promise<Blob> => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > mw) {
        height = Math.round((height * mw) / width);
        width = mw;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to compress image"));
        },
        "image/jpeg",
        q
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });

  let result = await compress(quality, maxWidth);

  // If still too large for DB fallback, reduce quality progressively
  if (result.size > MAX_DB_UPLOAD_SIZE) {
    for (const lowerQuality of [0.6, 0.4, 0.2]) {
      result = await compress(lowerQuality, maxWidth);
      if (result.size <= MAX_DB_UPLOAD_SIZE) break;
    }
  }

  // If still too large, reduce dimensions
  if (result.size > MAX_DB_UPLOAD_SIZE && maxWidth > 400) {
    result = await compress(0.5, 600);
  }

  return result;
}

// ─── Audio Compression ───

/**
 * Compress an audio File using Web Audio API + MediaRecorder.
 * Target: under 3MB for database fallback.
 */
export async function compressAudioFile(
  file: File,
  targetBitrate: number = 96000 // 96kbps — good quality, reasonable size
): Promise<Blob> {
  if (file.size <= MAX_DB_UPLOAD_SIZE) return file;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (typeof MediaRecorder !== 'undefined') {
      const mimeTypes = ['audio/ogg;codecs=opus', 'audio/webm;codecs=opus', 'audio/webm'];
      let selectedMime = '';
      for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
          selectedMime = mime;
          break;
        }
      }

      if (selectedMime) {
        const audioCtx2 = new AudioContext({ sampleRate: 44100 });
        const source = audioCtx2.createBufferSource();
        source.buffer = audioBuffer;
        const dest = audioCtx2.createMediaStreamDestination();
        source.connect(dest);

        const recorder = new MediaRecorder(dest.stream, {
          mimeType: selectedMime,
          audioBitsPerSecond: targetBitrate,
        });

        const chunks: Blob[] = [];
        const recordingPromise = new Promise<Blob>((resolve) => {
          recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
          recorder.onstop = () => { resolve(new Blob(chunks, { type: selectedMime })); };
        });

        source.start(0);
        recorder.start();

        const duration = Math.min(audioBuffer.duration, 300);
        setTimeout(() => {
          recorder.stop();
          source.stop();
          audioCtx2.close();
        }, (duration * 1000) + 200);

        const compressedBlob = await recordingPromise;
        await audioContext.close();

        if (compressedBlob.size < file.size) {
          console.log(`Audio compressed: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(compressedBlob.size / 1024 / 1024).toFixed(1)}MB`);
          return compressedBlob;
        }
      }
    }

    audioContext.close();
    return file;
  } catch (err) {
    console.warn("Audio compression failed:", err);
    return file;
  }
}

// ─── File to Base64 ───

export function fileToBase64DataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ─── PRIMARY: Cloudinary Upload ───

/**
 * Upload a Blob/File to Cloudinary via our API route.
 * Files are stored on Cloudinary CDN — 25GB storage, 25GB bandwidth/month.
 * Auto image optimization built in.
 */
async function uploadToCloudinary(
  file: Blob | File,
  folder: string,
  fileName: string,
  contentType: string
): Promise<string> {
  const fileSize = file instanceof File ? file.size : (file as Blob).size;
  if (fileSize > MAX_CLOUDINARY_UPLOAD_SIZE) {
    throw new Error(`File terlalu besar untuk Cloudinary (${(fileSize / 1024 / 1024).toFixed(1)}MB). Maksimal 25MB.`);
  }

  const ext = contentType
    ?.split("/")[1]
    ?.replace("jpeg", "jpg")
    ?.replace("mpeg", "mp3")
    ?.replace("x-wav", "wav")
    ?.replace("ogg", "ogg") || "bin";

  const fileObj = new File([file], `${fileName}.${ext}`, { type: contentType });

  const formData = new FormData();
  formData.append("file", fileObj);
  formData.append("folder", folder);
  formData.append("name", fileName);

  const res = await fetch("/api/upload-cloudinary", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Cloudinary upload gagal");
  }

  const result = (await res.json()) as { url: string; publicId: string; stored: string };
  return result.url;
}

// ─── FALLBACK 1: Supabase Storage Upload (Signed URL) ───

/**
 * Fallback: Upload a Blob/File directly to Supabase Storage using a signed URL.
 * File goes from browser → Supabase CDN. Never touches Vercel serverless.
 */
async function uploadViaSignedUrl(
  file: Blob | File,
  folder: string,
  fileName: string,
  contentType: string
): Promise<string> {
  // Step 1: Get signed upload URL from our API
  const signedRes = await fetch("/api/upload-signed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, fileName, contentType }),
  });

  if (!signedRes.ok) {
    const err = await signedRes.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Gagal mendapatkan upload URL");
  }

  const { signedUrl, publicUrl } = (await signedRes.json()) as {
    signedUrl: string;
    publicUrl: string;
  };

  // Step 2: Upload directly to Supabase Storage
  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Gagal upload file ke Supabase Storage");
  }

  return publicUrl;
}

// ─── FALLBACK 2: Database Storage ───

/**
 * Fallback: Upload file to PostgreSQL database storage.
 * Subject to Vercel's 4.5MB body limit.
 */
async function uploadToDatabase(
  file: Blob | File,
  filePath: string,
  mimeType: string
): Promise<string> {
  const fileSize = file instanceof File ? file.size : (file as Blob).size;
  if (fileSize > MAX_DB_UPLOAD_SIZE) {
    throw new Error(`File terlalu besar untuk database (${(fileSize / 1024 / 1024).toFixed(1)}MB). Maksimal 4MB.`);
  }

  const formData = new FormData();
  const ext = mimeType
    .split("/")[1]
    ?.replace("jpeg", "jpg")
    ?.replace("mpeg", "mp3")
    ?.replace("x-wav", "wav") || "bin";
  const fileName = filePath.includes(".") ? filePath : `${filePath}.${ext}`;
  const fileObj = new File([file], fileName.split("/").pop() || fileName, { type: mimeType });

  formData.append("file", fileObj);
  formData.append("path", fileName);
  formData.append("mimeType", mimeType);

  const res = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Upload ke database gagal");
  }

  const result = (await res.json()) as { url: string; size: number };
  return result.url;
}

// ─── High-Level Upload Functions ───

let _uploadFolder: string | null = null;
export function getUploadFolder(): string {
  if (!_uploadFolder) {
    _uploadFolder = `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return _uploadFolder;
}

export function resetUploadFolder(): void {
  _uploadFolder = null;
}

/**
 * Full image upload pipeline: compress → Cloudinary → Supabase → Database → Base64.
 * Cloudinary provides auto-optimization & CDN delivery.
 */
export async function uploadImage(
  file: File,
  fileName: string,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<string> {
  const compressed = await compressImageFile(file, maxWidth, quality);
  const folder = getUploadFolder();

  // PRIMARY: Cloudinary (25GB storage, 25GB bandwidth, auto-optimization)
  try {
    return await uploadToCloudinary(compressed, folder, fileName, "image/jpeg");
  } catch (e) {
    console.warn("Cloudinary upload failed, trying Supabase:", e);
  }

  // FALLBACK 1: Supabase Storage (signed URL)
  try {
    return await uploadViaSignedUrl(compressed, folder, fileName, "image/jpeg");
  } catch (e) {
    console.warn("Supabase Storage failed, trying database:", e);
  }

  // FALLBACK 2: Database storage
  try {
    return await uploadToDatabase(compressed, `${folder}/${fileName}`, "image/jpeg");
  } catch (e) {
    console.warn("Database upload failed, using base64:", e);
  }

  // LAST RESORT: Base64
  return await fileToBase64DataUrl(compressed);
}

/**
 * Full audio upload pipeline: Cloudinary → Supabase → compress → Database → Base64.
 */
export async function uploadAudio(
  file: File,
  fileName: string = "custom-music"
): Promise<string> {
  const folder = getUploadFolder();
  const contentType = file.type || "audio/mpeg";

  // Check raw file size
  if (file.size > MAX_AUDIO_SIZE) {
    throw new Error(`File musik terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal ${MAX_AUDIO_SIZE / 1024 / 1024}MB.`);
  }

  // PRIMARY: Cloudinary (no body limit, CDN URL)
  try {
    return await uploadToCloudinary(file, folder, fileName, contentType);
  } catch (e) {
    console.warn("Cloudinary upload failed, trying Supabase:", e);
  }

  // FALLBACK 1: Supabase Storage (signed URL)
  try {
    return await uploadViaSignedUrl(file, folder, fileName, contentType);
  } catch (e) {
    console.warn("Supabase Storage failed, compressing and trying database:", e);
  }

  // Compress audio for database fallback (4MB limit)
  const compressed = await compressAudioFile(file, 64000);

  // FALLBACK 2: Database storage
  try {
    return await uploadToDatabase(compressed, `${folder}/${fileName}`, compressed.type || contentType);
  } catch (e) {
    console.warn("Database upload failed, using base64:", e);
  }

  // LAST RESORT: Base64
  if (compressed.size <= MAX_DB_UPLOAD_SIZE) {
    return await fileToBase64DataUrl(compressed);
  }

  throw new Error("Upload musik gagal. File terlalu besar. Coba gunakan file yang lebih kecil (di bawah 5MB).");
}

// ─── Utility Functions ───

export function isBase64DataUrl(value: string): boolean {
  return value.startsWith("data:");
}

export function isCloudUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}

export function isDatabaseUrl(value: string): boolean {
  return value.startsWith("/api/storage/");
}

export function isCloudinaryUrl(value: string): boolean {
  return value.includes("res.cloudinary.com");
}

export function estimateBase64Size(values: (string | undefined | null)[]): number {
  let totalBytes = 0;
  for (const val of values) {
    if (val && isBase64DataUrl(val)) {
      const base64Length = val.length - val.indexOf(',') - 1;
      totalBytes += Math.ceil(base64Length * 0.75);
    }
  }
  return totalBytes / (1024 * 1024);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
