import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ADMIN_USERNAME = "nauka";
const ADMIN_PASSWORD = "nauka2026";

/**
 * Get authenticated user from request.
 * Supports NextAuth session and admin bypass via headers.
 * Returns { userId, isAdmin } or null.
 */
function getAuthUser(request: NextRequest): { userId: string; isAdmin: boolean } | null {
  const headerUserId = request.headers.get("x-user-id");
  const headerAuth = request.headers.get("x-admin-auth");

  if (headerUserId && headerAuth) {
    try {
      const decoded = Buffer.from(headerAuth, "base64").toString();
      const [username, password] = decoded.split(":");
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return { userId: headerUserId, isAdmin: true };
      }
    } catch {
      // Invalid auth header format
    }
  }

  return null;
}

/**
 * Async version that also checks NextAuth session.
 */
async function getAuthUserAsync(
  request: NextRequest
): Promise<{ userId: string; isAdmin: boolean } | null> {
  // Check header-based auth first
  const headerAuth = getAuthUser(request);
  if (headerAuth) return headerAuth;

  // Check NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user) {
      const userId = (session.user as Record<string, unknown>).id as string;
      if (userId) {
        return { userId, isAdmin: false };
      }
    }
  } catch {
    // Session check failed
  }

  return null;
}

// ─── GET /api/template — List Templates ───
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adat = searchParams.get("adat");
    const nuansa = searchParams.get("nuansa");
    const design = searchParams.get("design");

    const where: Record<string, unknown> = {};
    if (adat) where.adat = adat;
    if (nuansa) where.nuansa = nuansa;
    if (design) where.design = design;

    const templates = await db.template.findMany({
      where,
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ templates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST /api/template — Create Template ───
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUserAsync(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, nuansa, adat, design, config, thumbnail } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama template wajib diisi" },
        { status: 400 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { error: "Config template wajib diisi" },
        { status: 400 }
      );
    }

    const template = await db.template.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        thumbnail: thumbnail || null,
        nuansa: nuansa || "islam",
        adat: adat || "jawa",
        design: design || "mewah",
        config,
        isDefault: false,
        createdBy: auth.isAdmin ? null : auth.userId,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
