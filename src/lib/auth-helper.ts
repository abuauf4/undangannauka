import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";

// Admin credentials for bypass authentication
const ADMIN_USERNAME = "nauka";
const ADMIN_PASSWORD = "nauka2026";
const ADMIN_USER_ID = "admin-nauka-001";

/**
 * Get the current authenticated session.
 * Returns null if not authenticated.
 */
export async function getAuthSession() {
  return getServerSession(authOptions);
}

/**
 * Require authentication. Returns userId if authenticated, or a Response error if not.
 *
 * Supports two authentication methods:
 * 1. NextAuth session (standard login)
 * 2. Admin bypass via x-user-id and x-admin-auth headers
 *
 * Use in API routes like:
 *   const auth = await requireAuth(req);
 *   if (auth instanceof Response) return auth;
 *   const userId = auth.userId;
 */
export async function requireAuth(req?: NextRequest): Promise<{ userId: string; email: string } | Response> {
  // Method 1: Check NextAuth session first
  const session = await getAuthSession();
  if (session?.user) {
    const userId = (session.user as Record<string, unknown>).id as string;
    const email = session.user.email as string;
    if (userId) return { userId, email };
  }

  // Method 2: Admin bypass via x-user-id header
  if (req) {
    const headerUserId = req.headers.get("x-user-id");
    const headerAuth = req.headers.get("x-admin-auth");

    if (headerUserId && headerAuth) {
      try {
        const decoded = Buffer.from(headerAuth, "base64").toString();
        const [username, password] = decoded.split(":");
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          return { userId: headerUserId, email: "admin@undangannauka.com" };
        }
      } catch {
        // Invalid auth header format
      }
    }
  }

  return new Response(
    JSON.stringify({ error: "Anda harus login terlebih dahulu" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}

/**
 * Whitelist of fields allowed for mass update on Invitation.
 * Prevents mass assignment attacks (e.g., setting isPaid, userId, etc.)
 */
export const INVITATION_UPDATABLE_FIELDS = [
  "namaPria",
  "namaWanita",
  "namaOrtuPria",
  "namaOrtuWanita",
  "fotoPria",
  "fotoWanita",
  "tanggalAkad",
  "waktuAkad",
  "lokasiAkad",
  "alamatAkad",
  "mapsAkadUrl",
  "tanggalResepsi",
  "waktuResepsi",
  "lokasiResepsi",
  "alamatResepsi",
  "mapsResepsiUrl",
  "nuansa",
  "adat",
  "tingkat",
  "greeting",
  "ayatQuote",
  "musikUrl",
  "fotoGallery",
  "fotoBackground",
  "ourStory",
  "loveQuotes",
  "bridesmaidGroomsman",
  "weddingItinerary",
  "welcomeVideo",
  "amplopDigital",
  "isPublished",
] as const;

/**
 * Filter an object to only include whitelisted fields.
 * Prevents mass assignment by stripping dangerous fields like isPaid, paymentId, userId.
 */
export function sanitizeInvitationUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const key of INVITATION_UPDATABLE_FIELDS) {
    if (key in body) {
      sanitized[key] = body[key];
    }
  }
  return sanitized;
}
