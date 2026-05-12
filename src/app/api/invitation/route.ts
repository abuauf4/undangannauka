import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helper";

function generateSlug(namaPria: string, namaWanita: string): string {
  const sanitize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const base = `${sanitize(namaPria)}-dan-${sanitize(namaWanita)}`;
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    const body = await req.json();
    const {
      templateId, namaPria, namaWanita,
      namaOrtuPria, namaOrtuWanita, fotoPria, fotoWanita,
      tanggalAkad, waktuAkad, lokasiAkad, alamatAkad, mapsAkadUrl,
      tanggalResepsi, waktuResepsi, lokasiResepsi, alamatResepsi, mapsResepsiUrl,
      nuansa, adat, tingkat, greeting, ayatQuote, musikUrl, fotoGallery,
      fotoBackground, ourStory, loveQuotes, bridesmaidGroomsman,
      weddingItinerary, welcomeVideo, amplopDigital,
    } = body;

    if (!templateId || !namaPria || !namaWanita) {
      return NextResponse.json({ error: "templateId, namaPria, dan namaWanita wajib diisi" }, { status: 400 });
    }

    const slug = generateSlug(namaPria, namaWanita);

    const invitation = await db.invitation.create({
      data: {
        slug,
        templateId,
        namaPria,
        namaWanita,
        userId, // ← Now properly associated with the authenticated user
        namaOrtuPria: namaOrtuPria || null,
        namaOrtuWanita: namaOrtuWanita || null,
        fotoPria: fotoPria || null,
        fotoWanita: fotoWanita || null,
        tanggalAkad: tanggalAkad || null,
        waktuAkad: waktuAkad || null,
        lokasiAkad: lokasiAkad || null,
        alamatAkad: alamatAkad || null,
        mapsAkadUrl: mapsAkadUrl || null,
        tanggalResepsi: tanggalResepsi || null,
        waktuResepsi: waktuResepsi || null,
        lokasiResepsi: lokasiResepsi || null,
        alamatResepsi: alamatResepsi || null,
        mapsResepsiUrl: mapsResepsiUrl || null,
        nuansa: nuansa || null,
        adat: adat || null,
        tingkat: tingkat || null,
        greeting: greeting || null,
        ayatQuote: ayatQuote || null,
        musikUrl: musikUrl || null,
        fotoGallery: fotoGallery ? JSON.stringify(fotoGallery) : null,
        fotoBackground: fotoBackground || null,
        ourStory: ourStory ? JSON.stringify(ourStory) : null,
        loveQuotes: loveQuotes ? JSON.stringify(loveQuotes) : null,
        bridesmaidGroomsman: bridesmaidGroomsman ? JSON.stringify(bridesmaidGroomsman) : null,
        weddingItinerary: weddingItinerary ? JSON.stringify(weddingItinerary) : null,
        welcomeVideo: welcomeVideo || null,
        amplopDigital: amplopDigital ? JSON.stringify(amplopDigital) : null,
        isPublished: true,
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth instanceof Response) return auth;
    const { userId } = auth;

    // Only return invitations owned by the authenticated user
    const invitations = await db.invitation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ invitations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
