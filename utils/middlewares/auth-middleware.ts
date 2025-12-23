import { type NextRequest, NextResponse } from 'next/server';
import { myCookies, readCookieFromCookies } from '../cookies';
export const authPaths = ['login'];
export const privatePaths = ['dashboard'];

const isAuthPage = (pathname: string) => {
  return authPaths.some(route => {
    return pathname === `/${route}`;
  });
};
const isPrivatePage = (pathname: string) => {
  return (
    pathname.includes('dashboard') ||
    privatePaths.some(route => {
      return pathname === `/${route}`;
    })
  );
};

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const visitingPrivatePage = isPrivatePage(pathname);
  const visitingAuthPages = isAuthPage(pathname);
  const authToken = readCookieFromCookies(myCookies.auth, request.cookies);

  if (authToken && visitingAuthPages) {
    const homeUrl = new URL(`/dashboard`, request.url);
    homeUrl.search = request.nextUrl.search;

    return NextResponse.redirect(homeUrl, 302);
  }

  if (!authToken && visitingPrivatePage) {
    const loginUrl = new URL(`/login`, request.url);

    loginUrl.search = request.nextUrl.search;

    return NextResponse.redirect(loginUrl, 302);
  }
}
