import { getUserInfo } from "@utils/api";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  const { searchParams, pathname } = request.nextUrl;

  const unauthenticatedOnlyPrefixes = ["/login"] as const;
  const authenticatedOnlyPrefixes = ["/problems"] as const;
  const adminOnlyPrefixes = [
    // uncomment this in production
    // "/problems/create"
  ] as const;

  if (unauthenticatedOnlyPrefixes.some((path) => pathname.startsWith(path))) {
    const redirectTo = decodeURIComponent(searchParams.get("prev") ?? "%2Fbeta");
    if (request.cookies.get("token")) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  if (authenticatedOnlyPrefixes.some((path) => pathname.startsWith(path))) {
    const providedRedirect = searchParams.get("prev");
    const redirectTo = providedRedirect
      ? decodeURIComponent(providedRedirect)
      : `/beta/login?prev=${encodeURIComponent(pathname)}`;

    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    if (adminOnlyPrefixes.some((path) => pathname.startsWith(path))) {
      const userInfo = await getUserInfo(token.value);
      if (!userInfo.ok || userInfo.user.status !== "Admin") {
        return NextResponse.redirect(new URL("/beta", request.url));
      }
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/problems/:path*", "/login"],
};
