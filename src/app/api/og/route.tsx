import { NextRequest, NextResponse } from 'next/server';

/**
 * OG Image Generation API
 * Generates a simple SVG-based OG image for social sharing
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const namaPria = searchParams.get('pria') || 'Mempelai Pria';
  const namaWanita = searchParams.get('wanita') || 'Mempelai Wanita';
  const date = searchParams.get('date') || '';
  const nuansa = searchParams.get('nuansa') || 'islam';
  const adat = searchParams.get('adat') || 'jawa';

  const isJawa = adat === 'jawa';
  const bg = isJawa ? '#2C1810' : '#1a0a0a';
  const accent = '#D4AF37';
  const text = '#F5F0E6';
  const subtext = '#C9B896';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="50%" stop-color="${isJawa ? '#3D2215' : '#2C1810'}"/>
      <stop offset="100%" stop-color="${bg}"/>
    </linearGradient>
    <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Border frame -->
  <rect x="30" y="30" width="1140" height="570" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4" rx="8"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${accent}" stroke-width="1" opacity="0.2" rx="6"/>
  
  <!-- Top ornament -->
  <line x1="400" y1="80" x2="800" y2="80" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <circle cx="600" cy="80" r="4" fill="${accent}" opacity="0.6"/>
  
  <!-- Bismillah / Title -->
  <text x="600" y="140" text-anchor="middle" fill="${subtext}" font-size="24" font-family="serif" opacity="0.7">
    ${nuansa === 'islam' ? 'بسم الله الرحمن الرحيم' : 'The Wedding Of'}
  </text>
  
  <!-- Couple names -->
  <text x="600" y="250" text-anchor="middle" fill="${text}" font-size="56" font-family="serif" font-weight="bold">
    ${namaPria}
  </text>
  <text x="600" y="310" text-anchor="middle" fill="${accent}" font-size="40" font-family="serif">
    &amp;
  </text>
  <text x="600" y="380" text-anchor="middle" fill="${text}" font-size="56" font-family="serif" font-weight="bold">
    ${namaWanita}
  </text>
  
  <!-- Date -->
  ${date ? `<text x="600" y="440" text-anchor="middle" fill="${subtext}" font-size="20" font-family="serif">${date}</text>` : ''}
  
  <!-- Bottom ornament -->
  <line x1="400" y1="490" x2="800" y2="490" stroke="${accent}" stroke-width="1" opacity="0.5"/>
  <circle cx="600" cy="490" r="4" fill="${accent}" opacity="0.6"/>
  
  <!-- Branding -->
  <text x="600" y="560" text-anchor="middle" fill="${accent}" font-size="16" font-family="sans-serif" opacity="0.6">
    UndanganNauka
  </text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
