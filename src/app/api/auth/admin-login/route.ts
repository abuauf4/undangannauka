import { NextRequest, NextResponse } from "next/server";

const ADMIN_USERNAME = "nauka";
const ADMIN_PASSWORD = "nauka2026";
const ADMIN_USER_ID = "admin-nauka-001";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const authHeader = Buffer.from(`${username}:${password}`).toString("base64");
      return NextResponse.json({
        success: true,
        userId: ADMIN_USER_ID,
        authHeader,
        email: "admin@undangannauka.com",
      });
    }

    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
