import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { salons, users } from "@/db/schema";
import { cabinetHome, startSession } from "@/server/auth";
import { isAdminCustomer, startCustomerSession, upsertGoogleCustomer } from "@/server/customers";
import {
  finishGoogleSignIn,
  GOOGLE_SIGNUP_COOKIE,
  OAUTH_COOKIE,
  signGoogleSignup,
  type OAuthIntent,
} from "@/server/google";

export async function GET(request: NextRequest) {
  const jar = await cookies();
  const raw = jar.get(OAUTH_COOKIE)?.value;
  jar.delete(OAUTH_COOKIE);
  let saved: (OAuthIntent & { state: string; verifier: string }) | null = null;
  try {
    saved = raw ? JSON.parse(raw) : null;
  } catch {}
  const sp = request.nextUrl.searchParams;
  const locale = saved?.locale === "en" ? "en" : "pt";
  const code = sp.get("code");
  if (!saved || !code || sp.get("state") !== saved.state) redirect(`/${locale}/account?error=google`);

  let profile;
  try {
    profile = await finishGoogleSignIn(code, saved.verifier);
  } catch {
    redirect(`/${locale}/account?error=google`);
  }

  // The shared sign-in page: a business owner's e-mail opens their cabinet.
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, profile.email));
  if (saved.as === "client" && (saved.next || !user)) {
    const customer = await upsertGoogleCustomer(db, profile);
    await startCustomerSession(customer.id, customer.name);
    redirect(`/${locale}${saved.next || (isAdminCustomer(customer) ? "/admin" : "/account")}`);
  }

  // Business: sign in to an existing account with that e-mail, or finish signing up.
  if (user) {
    await startSession(user.id);
    const [salon] = await db.select({ kind: salons.kind }).from(salons).where(eq(salons.ownerId, user.id));
    redirect(`/${locale}${cabinetHome(salon?.kind ?? "salon")}`);
  }
  jar.set(GOOGLE_SIGNUP_COOKIE, signGoogleSignup({ email: profile.email, name: profile.name }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 1800,
  });
  redirect(`/${locale}/business/register?google=1`);
}
