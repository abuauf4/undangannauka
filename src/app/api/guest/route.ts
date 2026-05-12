import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helper";

// POST: Add guest / RSVP (public — used by invitation viewers)
export async function POST(req: NextRequest) {
  try {
    const { invitationId, name, email, phone, status, guestCount, message } = await req.json();

    if (!invitationId || !name) {
      return NextResponse.json({ error: "invitationId dan nama wajib diisi" }, { status: 400 });
    }

    // Validate invitation exists
    const invitation = await db.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    // Rate limit: max 10 RSVPs per invitation per minute (simple check)
    const oneMinuteAgo = new Date(Date.now() - 60_000);
    const recentRSVPs = await db.guest.count({
      where: {
        invitationId,
        createdAt: { gte: oneMinuteAgo },
      },
    });
    if (recentRSVPs >= 10) {
      return NextResponse.json(
        { error: "Terlalu banyak RSVP dalam waktu singkat. Coba lagi nanti." },
        { status: 429 }
      );
    }

    const guest = await db.guest.create({
      data: {
        invitationId,
        name,
        email: email || null,
        phone: phone || null,
        status: status || "pending",
        guestCount: guestCount || 1,
        message: message || null,
      },
    });

    // Only increment RSVP count for "attending" status
    if (status === "attending") {
      await db.invitation.update({
        where: { id: invitationId },
        data: { rsvpCount: { increment: guestCount || 1 } },
      });
    }

    return NextResponse.json({ guest }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: List guests for an invitation (requires auth — owner only)
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitationId");

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId wajib" }, { status: 400 });
    }

    // Verify ownership
    const invitation = await db.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation || (invitation.userId && invitation.userId !== userId)) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }

    const guests = await db.guest.findMany({
      where: { invitationId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ guests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
