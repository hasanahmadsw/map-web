import { type NextRequest, NextResponse } from "next/server";
import { i18n, type Lang } from "@/utils/dictionary-utils";
import { myCookies, readCookieFromCookies } from "../cookies";
export const authPaths = ["login"];
export const privatePaths = ["dashboard"];

const isAuthPage = (pathname: string) => {
  return authPaths.some((route) => {
    return pathname === `/${route}`;
  });
};
const isPrivatePage = (pathname: string) => {
  return (
    pathname.includes("dashboard") ||
    privatePaths.some((route) => {
      return pathname === `/${route}`;
    })
  );
};

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const langs = i18n.langs;

  let pathWithoutLang = pathname;
  for (const lang of langs) {
    if (pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`) {
      pathWithoutLang = pathname.slice(lang.length + 1) || "/";
      break;
    }
  }

  const visitingPrivatePage = isPrivatePage(pathWithoutLang);
  const visitingAuthPages = isAuthPage(pathWithoutLang);
  const authToken = readCookieFromCookies(myCookies.auth, request.cookies);

  if (authToken && visitingAuthPages) {
    const homeUrl = new URL(
      `/${langs.includes(pathname.split("/")[1] as Lang) ? pathname.split("/")[1] : ""}/dashboard`,
      request.url,
    );
    homeUrl.search = request.nextUrl.search;

    return NextResponse.redirect(homeUrl, 302);
  }

  if (!authToken && visitingPrivatePage) {
    const langPrefix = langs.includes(pathname.split("/")[1] as Lang) ? pathname.split("/")[1] : "";
    const loginUrl = new URL(`/${langPrefix}/login`, request.url);

    loginUrl.search = request.nextUrl.search;

    return NextResponse.redirect(loginUrl, 302);
  }
}
