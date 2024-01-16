import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Fala tu")
  return NextResponse.json({ message: "Hello, world!" });
}
