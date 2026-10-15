import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { beginGoogleSignIn, googleConfigured, OAUTH_COOKIE } from "@/server/google";

// GET /api/auth/google/start?as=client|business&locale=pt[&next=/salon/x/book?...]
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const locale = sp.get("locale") === "en" ? "en" : "pt";
  if (!googleConfigured()) redirect(`/${locale}/account`);
  const next = sp.get("next") ?? "";
  const { url, cookie } = beginGoogleSignIn({
    as: sp.get("as") === "business" ? "business" : "client",
    locale,
    // Only paths on this site, never another host.
    next: next.startsWith("/") && !next.startsWith("//") ? next : "",
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
