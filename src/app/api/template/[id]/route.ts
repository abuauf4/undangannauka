import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ADMIN_USERNAME = "nauka";
const ADMIN_PASSWORD = "nauka2026";

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

async function getAuthUserAsync(
  request: NextRequest
): Promise<{ userId: string; isAdmin: boolean } | null> {
  const headerAuth = getAuthUser(request);
  if (headerAuth) return headerAuth;

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

// ─── GET /api/template/[id] — Get Single Template ───
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const template = await db.template.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── PUT /api/template/[id] — Update Template ───
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUserAsync(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.template.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cannot update default templates unless admin
    if (existing.isDefault && !auth.isAdmin) {
      return NextResponse.json(
        { error: "Template default tidak dapat diubah" },
        { status: 403 }
      );
    }

    // Non-admin can only update their own templates
    if (!auth.isAdmin && existing.createdBy !== auth.userId) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk mengubah template ini" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, nuansa, adat, design, config, thumbnail } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail || null;
    if (nuansa !== undefined) updateData.nuansa = nuansa;
    if (adat !== undefined) updateData.adat = adat;
    if (design !== undefined) updateData.design = design;
    if (config !== undefined) updateData.config = config;

    // Ensure name is not empty if provided
    if (name !== undefined && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Nama template tidak boleh kosong" },
        { status: 400 }
      );
    }

    const template = await db.template.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ template });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/template/[id] — Delete Template ───
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUserAsync(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await db.template.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cannot delete default templates
    if (existing.isDefault) {
      return NextResponse.json(
        { error: "Template default tidak dapat dihapus" },
        { status: 403 }
      );
    }

    // Non-admin can only delete their own templates
    if (!auth.isAdmin && existing.createdBy !== auth.userId) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus template ini" },
        { status: 403 }
      );
    }

    await db.template.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
