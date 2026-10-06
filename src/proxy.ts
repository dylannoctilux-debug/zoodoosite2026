import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path !== "/admin/login" && !request.cookies.get("auth_session")?.value)
    return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: "/admin/:path*" };
