import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple in-memory view count deduplication (per-process, resets on deploy)
const viewCache = new Map<string, { count: number; lastView: number }>();
const VIEW_THROTTLE_MS = 60 * 60 * 1000; // 1 hour per slug per "session"
const MAX_CACHE_SIZE = 10000;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const invitation = await db.invitation.findUnique({
      where: { slug },
      include: { guests: true, guestbook: { orderBy: { createdAt: "desc" } } },
    });
    if (!invitation) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Throttled view count increment — only count once per slug per hour per IP
    const clientIp = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const cacheKey = `${slug}:${clientIp}`;
    const now = Date.now();
    const cached = viewCache.get(cacheKey);

    if (!cached || (now - cached.lastView) > VIEW_THROTTLE_MS) {
      // Increment view count
      await db.invitation.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
      });

      viewCache.set(cacheKey, { count: (cached?.count || 0) + 1, lastView: now });

      // Prevent memory leak — trim cache if too large
      if (viewCache.size > MAX_CACHE_SIZE) {
        const oldestKey = viewCache.keys().next().value;
        if (oldestKey) viewCache.delete(oldestKey);
      }
    }

    return NextResponse.json({ invitation });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
