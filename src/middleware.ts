import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { routing } from "./i18n/routing";
import createIntlMiddleware from "next-intl/middleware";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  // Authentication check for protected routes
  const token = req.cookies.get("token")?.value;
  const decoded = token ? await verifyToken(token) : null;

  // Check if the pathname starts with a supported locale
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (
    decoded &&
    (pathname.startsWith(`/${routing.defaultLocale}/auth/login`) ||
      pathname.startsWith(`/${routing.defaultLocale}/auth/register`))
  ) {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}/`, req.url)
    );
  }
  if (
    pathnameIsMissingLocale &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")
  ) {
    return NextResponse.redirect(
      new URL(`/${routing.defaultLocale}${pathname}`, req.url)
    );
  }

  // RBAC checks
  if (pathname.includes("/admin") && decoded?.role !== "ADMIN") {
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
  }

  // Handle internationalization for paths with locales
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    return intlResponse;
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    `${routing.defaultLocale}/auth/login`,
    `${routing.defaultLocale}/auth/register`,
    `${routing.defaultLocale}/unauthorized`,
  ];
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname.includes(route) ||
      routing.locales.some((locale) =>
        pathname.startsWith(`/${locale}${route}`)
      )
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    // Extract locale from pathname for redirect
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  try {
    // Since verifyToken is now async with jose, we need to await it
    const decoded = (await verifyToken(token)) as { role?: string };

    // Check if role exists in the decoded token
    if (!decoded || !decoded.role) {
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
    }

    if (decoded && decoded.role === "USER") {
      return NextResponse.redirect(
        new URL(`/${routing.defaultLocale}/`, req.url)
      );
    }

    // Add additional role checks as needed
    if (
      pathname.includes("/dashboard") &&
      !["ADMIN", "USER"].includes(decoded.role)
    ) {
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Clear the invalid token
    const localeMatch = pathname.match(/^\/([a-z]{2})\//);
    const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
    const response = NextResponse.redirect(
      new URL(`/${locale}/auth/login`, req.url)
    );
    response.cookies.delete("token");
    return response;
  }
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
