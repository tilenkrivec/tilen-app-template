import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "auth-token";
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const AUTH_SECRET = process.env.AUTH_SECRET;

// Only validate at runtime, not at build time
const getSecretKey = () => {
  if (!AUTH_SECRET) {
    throw new Error(
      "AUTH_SECRET environment variable is not set. Generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(AUTH_SECRET);
};

const secretKey = AUTH_SECRET ? new TextEncoder().encode(AUTH_SECRET) : null;

export interface SessionPayload extends JWTPayload {
  authenticated: boolean;
  expiresAt: number;
}

/**
 * Creates a JWT token for authenticated session
 */
export async function createSession(): Promise<string> {
  const key = secretKey || getSecretKey();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session: SessionPayload = {
    authenticated: true,
    expiresAt: expiresAt.getTime(),
  };

  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .sign(key);
}

/**
 * Verifies a JWT token and returns the session payload
 */
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const key = secretKey || getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Validates the provided password against the environment variable
 */
export function validatePassword(password: string): boolean {
  if (!AUTH_PASSWORD) {
    console.error("AUTH_PASSWORD environment variable is not set");
    return false;
  }
  return password === AUTH_PASSWORD;
}

/**
 * Sets the authentication cookie in the response
 */
export async function setAuthCookie(response: NextResponse): Promise<void> {
  const token = await createSession();
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Clears the authentication cookie
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAME);
}

/**
 * Checks if the request is authenticated (for middleware)
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return false;

  const session = await verifySession(token);
  if (!session) return false;

  // Check if session is expired
  if (session.expiresAt < Date.now()) return false;

  return session.authenticated;
}

/**
 * Gets the current auth status from cookies (for server components)
 */
export async function getAuthStatus(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return false;

  const session = await verifySession(token);
  if (!session) return false;

  // Check if session is expired
  if (session.expiresAt < Date.now()) return false;

  return session.authenticated;
}
