import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth, sanitizeInvitationUpdate } from "@/lib/auth-helper";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { id } = await params;
    const invitation = await db.invitation.findUnique({ where: { id } });
    if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only owner can view their invitation details
    if (invitation.userId && invitation.userId !== userId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }

    return NextResponse.json({ invitation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const { id } = await params;

    // Verify ownership first
    const existing = await db.invitation.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.userId && existing.userId !== userId) {
      return NextResponse.json({ error: "Anda tidak memiliki akses" }, { status: 403 });
    }

    const body = await req.json();

    // CRITICAL: Sanitize body to prevent mass assignment attacks
    // Strips dangerous fields like isPaid, paymentId, userId, etc.
    const sanitizedData = sanitizeInvitationUpdate(body);

    const invitation = await db.invitation.update({
      where: { id },
      data: sanitizedData,
    });
    return NextResponse.json({ invitation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
