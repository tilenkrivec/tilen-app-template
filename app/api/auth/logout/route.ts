import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearAuthCookie(response);
  return response;
}

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url));
  clearAuthCookie(response);
  return response;
}
