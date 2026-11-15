import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "";
    const region = /^[A-Z]{2}$/.test(country) ? country : "US";
    return NextResponse.json({ region });
  } catch {
    return NextResponse.json({ region: "US" });
  }
}
