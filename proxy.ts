import { type NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./utils/middlewares/auth-middleware";
import { langMiddleware } from "./utils/middlewares/lang-middleware";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const langResult = langMiddleware(request);
  if (langResult) {
    return langResult;
  }

  const authResult = authMiddleware(request);
  if (authResult) return authResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|robots\\.txt|sitemap\\.xml|manifest\\.json|sw\\.js|workbox-.*\\.js|\\.well-known).*)",
  ],
};
