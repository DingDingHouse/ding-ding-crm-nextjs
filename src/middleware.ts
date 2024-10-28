import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export default function middleware(req: NextRequest) {
  const loggedin = req.cookies.get("userToken");
  const { pathname } = req.nextUrl;

  // Redirect to login if user is not logged in
  if (!loggedin && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (loggedin) {
    const decodedToken = jwt.decode(loggedin.value) as { exp?: number, role?: string };

    if (decodedToken?.exp && Date.now() >= decodedToken.exp * 1000) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.set("userToken", "", { maxAge: -1, path: '/' });
      return response;
    }
    if (pathname === "/login") {
      return NextResponse.redirect(new URL(`/`, req.url));
    }

    if (
      decodedToken?.role !== "company" &&
      (pathname.startsWith("/game/") ||
      ["/game", "/transaction/all", "/clients/all", "/add-game"].includes(pathname))
  ) {
      return NextResponse.redirect(new URL(`/`, req.url));
  }
  }

  return NextResponse.next();
}

export const config = { matcher: "/((?!api|static|.*\\..*|_next).*)" };
