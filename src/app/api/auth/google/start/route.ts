import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { toLocale } from "@/i18n/routing";
import { safeNext } from "@/lib/next-path";
import { beginGoogleSignIn, googleConfigured, OAUTH_COOKIE } from "@/server/google";

// GET /api/auth/google/start?as=client|business&locale=pt[&next=/salon/x/book?...]
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const locale = toLocale(sp.get("locale"));
  if (!googleConfigured()) redirect(`/${locale}/account`);
  const { url, cookie } = beginGoogleSignIn({
    as: sp.get("as") === "business" ? "business" : "client",
    locale,
    next: safeNext(sp.get("next")),
  });
  (await cookies()).set(OAUTH_COOKIE, cookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  redirect(url);
}
