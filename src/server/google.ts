import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { GoogleProfile } from "./customers";

/**
 * "Sign in with Google" (OpenID Connect, authorization code flow with PKCE).
 * Turned on by GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET; the buttons stay hidden without them.
 */
export const googleConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";
export const googleRedirectUri = () => `${appUrl()}/api/auth/google/callback`;

export const OAUTH_COOKIE = "ba_oauth";
export type OAuthIntent = { as: "client" | "business"; locale: string; next: string };

const b64url = (buf: Buffer) => buf.toString("base64url");

/** Starts a sign-in: the URL to send the browser to, and the state to keep in a cookie. */
export function beginGoogleSignIn(intent: OAuthIntent) {
  const state = b64url(randomBytes(24));
  const verifier = b64url(randomBytes(32));
  const challenge = b64url(createHash("sha256").update(verifier).digest());
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return { url: url.toString(), cookie: JSON.stringify({ state, verifier, ...intent }) };
}

/** Trades the code for the user's profile; only a verified e-mail is accepted. */
export async function finishGoogleSignIn(code: string, verifier: string, fetcher: typeof fetch = fetch): Promise<GoogleProfile> {
  const tokenRes = await fetcher("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      code_verifier: verifier,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) throw new Error("google_token");
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  const infoRes = await fetcher("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${access_token}` },
  });
  if (!infoRes.ok) throw new Error("google_userinfo");
  const info = (await infoRes.json()) as { sub?: string; email?: string; email_verified?: boolean; name?: string };
  if (!info.sub || !info.email || info.email_verified !== true) throw new Error("google_unverified");
  return { sub: info.sub, email: info.email.toLowerCase(), name: info.name ?? "" };
}

// A business that signs up with Google finishes the form without a password; the verified
// e-mail and name travel to the form in a short-lived signed cookie.
export const GOOGLE_SIGNUP_COOKIE = "ba_google_signup";
const SIGNUP_MINUTES = 30;
const sign = (data: string) =>
  createHmac("sha256", `signup:${process.env.GOOGLE_CLIENT_SECRET ?? ""}`).update(data).digest("base64url");

export function signGoogleSignup(profile: { email: string; name: string }, now = Date.now()) {
  const data = b64url(Buffer.from(JSON.stringify({ ...profile, exp: now + SIGNUP_MINUTES * 60_000 })));
  return `${data}.${sign(data)}`;
}

export function readGoogleSignup(value: string | undefined, now = Date.now()): { email: string; name: string } | null {
  if (!value || !googleConfigured()) return null;
  const [data, mac] = value.split(".");
  if (!data || !mac) return null;
  const expected = Buffer.from(sign(data));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(data, "base64url").toString()) as { email: string; name: string; exp: number };
    return parsed.exp > now ? { email: parsed.email, name: parsed.name } : null;
  } catch {
    return null;
  }
}
