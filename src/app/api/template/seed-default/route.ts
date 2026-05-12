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

/**
 * Default "Royal Islamic Jawa" template configuration.
 * Matches the current hardcoded Javanese layout used in the invitation page.
 */
const DEFAULT_TEMPLATE_CONFIG = {
  sections: [
    {
      key: "hero",
      enabled: true,
      elements: [
        {
          id: "el-1",
          component: "WayangKalpataru",
          position: "center",
          animation: "sway",
          duration: 6,
          delay: 0.3,
          size: "large",
          opacity: 1,
        },
      ],
    },
    {
      key: "guest-welcome",
      enabled: true,
      elements: [
        {
          id: "el-2",
          component: "BatikScallopTop",
          position: "above",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-3",
          component: "AksaraJawaOrnament",
          position: "below",
          animation: "shimmer",
          duration: 3,
          delay: 0,
          size: "medium",
          opacity: 1,
          props: { text: "ꦱꦶꦤꦺꦴꦩ꧀" },
        },
        {
          id: "el-4",
          component: "BatikScallopBottom",
          position: "below",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
      ],
    },
    {
      key: "mempelai",
      enabled: true,
      elements: [
        {
          id: "el-5",
          component: "WayangArjuna",
          position: "flank-left",
          animation: "sway",
          duration: 7,
          delay: 0,
          size: "medium",
          opacity: 0.2,
        },
        {
          id: "el-6",
          component: "WayangSrikandi",
          position: "flank-right",
          animation: "swayReverse",
          duration: 7,
          delay: 0,
          size: "medium",
          opacity: 0.2,
        },
      ],
    },
    {
      key: "adat-pepatah",
      enabled: true,
      elements: [
        {
          id: "el-7",
          component: "BatikScallopTop",
          position: "above",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-8",
          component: "BatikScallopBottom",
          position: "below",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
      ],
    },
    {
      key: "quran-verse",
      enabled: true,
      elements: [
        {
          id: "el-9",
          component: "MegamendungLeft",
          position: "flank-left",
          animation: "drift",
          duration: 12,
          delay: 0,
          size: "small",
          opacity: 0.3,
        },
        {
          id: "el-10",
          component: "MegamendungRight",
          position: "flank-right",
          animation: "driftReverse",
          duration: 12,
          delay: 0,
          size: "small",
          opacity: 0.3,
        },
      ],
    },
    {
      key: "event-details",
      enabled: true,
      elements: [
        {
          id: "el-11",
          component: "BatikScallopTop",
          position: "above",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-12",
          component: "JavaneseDoubleBorder",
          position: "center",
          animation: "fadeIn",
          duration: 0.8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-13",
          component: "BatikScallopBottom",
          position: "below",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
      ],
    },
    {
      key: "countdown",
      enabled: true,
      elements: [
        {
          id: "el-14",
          component: "WayangKalpataru",
          position: "above",
          animation: "sway",
          duration: 6,
          delay: 0,
          size: "medium",
          opacity: 0.6,
        },
        {
          id: "el-15",
          component: "WayangArjuna",
          position: "flank-left",
          animation: "sway",
          duration: 7,
          delay: 0,
          size: "small",
          opacity: 0.8,
        },
        {
          id: "el-16",
          component: "WayangSrikandi",
          position: "flank-right",
          animation: "swayReverse",
          duration: 7,
          delay: 0,
          size: "small",
          opacity: 0.8,
        },
        {
          id: "el-17",
          component: "AksaraJawaOrnament",
          position: "below",
          animation: "shimmer",
          duration: 3,
          delay: 0.2,
          size: "medium",
          opacity: 1,
          props: { text: "ꦩꦸꦒꦶ" },
        },
      ],
    },
    {
      key: "rsvp",
      enabled: true,
      elements: [
        {
          id: "el-18",
          component: "AksaraJawaOrnament",
          position: "above",
          animation: "shimmer",
          duration: 3,
          delay: 0,
          size: "medium",
          opacity: 1,
          props: { text: "ꦏꦶꦫꦶꦩ꧀" },
        },
        {
          id: "el-19",
          component: "BatikStripBorder",
          position: "above",
          animation: "shimmer",
          duration: 6,
          delay: 0,
          size: "full",
          opacity: 1,
        },
      ],
    },
    {
      key: "guestbook",
      enabled: true,
      elements: [
        {
          id: "el-20",
          component: "BatikScallopTop",
          position: "above",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-21",
          component: "BatikScallopBottom",
          position: "below",
          animation: "shimmer",
          duration: 8,
          delay: 0,
          size: "full",
          opacity: 1,
        },
      ],
    },
    {
      key: "closing",
      enabled: true,
      elements: [
        {
          id: "el-22",
          component: "BatikStripBorder",
          position: "above",
          animation: "shimmer",
          duration: 6,
          delay: 0,
          size: "full",
          opacity: 1,
        },
        {
          id: "el-23",
          component: "WayangArjuna",
          position: "flank-left",
          animation: "sway",
          duration: 7,
          delay: 0,
          size: "small",
          opacity: 0.8,
        },
        {
          id: "el-24",
          component: "WayangKalpataru",
          position: "center",
          animation: "sway",
          duration: 6,
          delay: 0.2,
          size: "medium",
          opacity: 0.8,
        },
        {
          id: "el-25",
          component: "WayangSrikandi",
          position: "flank-right",
          animation: "swayReverse",
          duration: 7,
          delay: 0,
          size: "small",
          opacity: 0.8,
        },
        {
          id: "el-26",
          component: "AksaraJawaOrnament",
          position: "below",
          animation: "shimmer",
          duration: 3,
          delay: 0,
          size: "medium",
          opacity: 1,
          props: { text: "ꦩꦠꦸꦂ ꦤꦸꦮꦸꦤ꧀" },
        },
      ],
    },
  ],
};

// ─── POST /api/template/seed-default — Seed Default Template ───
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUserAsync(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Anda harus login terlebih dahulu" },
        { status: 401 }
      );
    }

    // Only admin can seed the default template
    if (!auth.isAdmin) {
      return NextResponse.json(
        { error: "Hanya admin yang dapat membuat template default" },
        { status: 403 }
      );
    }

    // Check if a default template already exists
    const existingDefault = await db.template.findFirst({
      where: { isDefault: true },
    });

    if (existingDefault) {
      return NextResponse.json(
        { error: "Template default sudah ada", template: existingDefault },
        { status: 409 }
      );
    }

    const template = await db.template.create({
      data: {
        name: "Royal Islamic Jawa",
        description:
          "Template undangan pernikahan bergaya keraton Jawa dengan ornamen wayang, batik, dan aksara Jawa. Nuansa Islami dengan desain mewah.",
        nuansa: "islam",
        adat: "jawa",
        design: "mewah",
        config: DEFAULT_TEMPLATE_CONFIG,
        isDefault: true,
        createdBy: null,
      },
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
