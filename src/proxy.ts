import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (
    token &&
    (
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register")
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    !token &&
    (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/change-password") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/projects")
    )
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/change-password",
    "/profile/:path*",
    "/projects/:path*"
  ],
};