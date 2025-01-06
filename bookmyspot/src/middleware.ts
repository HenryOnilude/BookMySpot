import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || 
                    request.nextUrl.pathname.startsWith("/register");

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Add role-based protection here if needed
    // const userType = token.type;
    // const path = request.nextUrl.pathname;
    // if (path.includes("/admin") && userType !== "ADMIN") {
    //   return NextResponse.redirect(new URL("/dashboard", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
    "/login",
    "/register",
  ],
};
