import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/logout", "/"];

// Define route patterns for authenticated areas
const authenticatedRoutePattern = /^\/(dashboard|settings|profile)/;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires authentication
  const isProtectedRoute = authenticatedRoutePattern.test(pathname);
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check authentication status
  const authenticated = await isAuthenticated(request);

  // If accessing protected route and not authenticated, redirect to login
  if (isProtectedRoute && !authenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
