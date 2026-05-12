import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helper";

// POST: Add guestbook entry (public — used by invitation viewers)
export async function POST(req: NextRequest) {
  try {
    const { invitationId, name, message } = await req.json();

    if (!invitationId || !name || !message) {
      return NextResponse.json({ error: "invitationId, nama, dan pesan wajib diisi" }, { status: 400 });
    }

    // Validate invitation exists
    const invitation = await db.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    // Rate limit: max 5 guestbook entries per invitation per minute
    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recentEntries = await db.guestbookEntry.count({
      where: {
        invitationId,
        createdAt: { gte: oneMinuteAgo },
      },
    });
    if (recentEntries >= 5) {
      return NextResponse.json(
        { error: "Terlalu banyak pesan dalam waktu singkat. Coba lagi nanti." },
        { status: 429 }
      );
    }

    // Sanitize input — strip HTML tags
    const sanitizedName = name.replace(/<[^>]*>/g, "").trim().slice(0, 100);
    const sanitizedMessage = message.replace(/<[^>]*>/g, "").trim().slice(0, 1000);

    if (!sanitizedName || !sanitizedMessage) {
      return NextResponse.json({ error: "Nama dan pesan tidak boleh kosong" }, { status: 400 });
    }

    const entry = await db.guestbookEntry.create({
      data: { invitationId, name: sanitizedName, message: sanitizedMessage },
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: List guestbook entries for an invitation (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitationId");

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId wajib" }, { status: 400 });
    }

    const entries = await db.guestbookEntry.findMany({
      where: { invitationId, isHidden: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Toggle hide/show guestbook entry (auth required — owner only)
export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { id, isHidden } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    // Verify ownership: entry → invitation → userId
    const entry = await db.guestbookEntry.findUnique({ where: { id } });
    if (!entry) {
      return NextResponse.json({ error: "Entry tidak ditemukan" }, { status: 404 });
    }

    const invitation = await db.invitation.findUnique({ where: { id: entry.invitationId } });
    if (!invitation || (invitation.userId && invitation.userId !== userId)) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }

    const updatedEntry = await db.guestbookEntry.update({
      where: { id },
      data: { isHidden: isHidden ?? false },
    });

    return NextResponse.json({ entry: updatedEntry });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
