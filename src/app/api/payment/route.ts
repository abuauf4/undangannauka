import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helper";

// POST: Mark invitation as paid (auth required — owner only)
// TODO: Replace with real Midtrans/Xendit webhook verification before production launch
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { invitationId, paymentId } = await req.json();

    if (!invitationId) {
      return NextResponse.json({ error: "invitationId wajib" }, { status: 400 });
    }

    // Verify ownership
    const invitation = await db.invitation.findUnique({ where: { id: invitationId } });
    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }
    if (invitation.userId && invitation.userId !== userId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }
    if (invitation.isPaid) {
      return NextResponse.json({ error: "Undangan sudah dibayar" }, { status: 400 });
    }

    // TODO: In production, verify paymentId with Midtrans/Xendit API
    // For now, we only allow marking as paid if a valid paymentId from gateway is provided
    if (!paymentId || !paymentId.startsWith("PAY-")) {
      return NextResponse.json(
        { error: "Payment ID tidak valid. Pembayaran harus melalui gateway resmi." },
        { status: 400 }
      );
    }

    await db.invitation.update({
      where: { id: invitationId },
      data: { isPaid: true, paymentId, isPublished: true },
    });

    return NextResponse.json({
      success: true,
      paymentId,
      message: "Pembayaran berhasil dicatat.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET: Check payment status (auth required — owner only)
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

    const invitation = await db.invitation.findUnique({
      where: { id: invitationId },
      select: { isPaid: true, paymentId: true, userId: true },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });
    }

    if (invitation.userId && invitation.userId !== userId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }

    return NextResponse.json({ invitation: { isPaid: invitation.isPaid, paymentId: invitation.paymentId } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
