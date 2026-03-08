import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // Converts JWT_SECRET string into bytes required by jwtVerify.
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

// Token validator function
async function isValidToken(token: string) {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value; // Reads JWT from cookie named token
  const { pathname } = request.nextUrl; // Gets current route path

  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/login";

  const loggedIn = token ? await isValidToken(token) : false;

  if (isProtectedRoute && !loggedIn) {
    // If protected route and not logged in: redirect to /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginPage && loggedIn) {
    // If already logged in and trying /login: redirect to /
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
