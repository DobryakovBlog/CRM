import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { beginGoogleSignIn, finishGoogleSignIn, readGoogleSignup, signGoogleSignup } from "./google";

beforeEach(() => {
  process.env.GOOGLE_CLIENT_ID = "client-id";
  process.env.GOOGLE_CLIENT_SECRET = "client-secret";
});
afterEach(() => {
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;
});

const fakeGoogle = (userinfo: object) =>
  (async (input: string | URL | Request) =>
    String(input).includes("/token")
      ? Response.json({ access_token: "at" })
      : Response.json(userinfo)) as typeof fetch;

describe("Google sign-in", () => {
  it("sends the browser to Google with PKCE and keeps the state", () => {
    const { url, cookie } = beginGoogleSignIn({ as: "client", locale: "pt", next: "" });
    const u = new URL(url);
    const saved = JSON.parse(cookie);
    expect(u.host).toBe("accounts.google.com");
    expect(u.searchParams.get("state")).toBe(saved.state);
    expect(u.searchParams.get("code_challenge_method")).toBe("S256");
    expect(u.searchParams.get("code_challenge")).not.toBe(saved.verifier);
  });

  it("accepts only a verified e-mail", async () => {
    const ok = await finishGoogleSignIn("code", "v", fakeGoogle({ sub: "1", email: "A@B.pt", email_verified: true, name: "Ana" }));
    expect(ok).toEqual({ sub: "1", email: "a@b.pt", name: "Ana" });
    await expect(
      finishGoogleSignIn("code", "v", fakeGoogle({ sub: "1", email: "a@b.pt", email_verified: false })),
    ).rejects.toThrow("google_unverified");
  });

  it("signs the business sign-up hand-off and rejects tampering or expiry", () => {
    const now = Date.now();
    const token = signGoogleSignup({ email: "a@b.pt", name: "Ana" }, now);
    expect(readGoogleSignup(token, now)).toEqual({ email: "a@b.pt", name: "Ana" });
    const [data, mac] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ email: "boss@b.pt", name: "X", exp: now + 1e6 })).toString("base64url");
    expect(readGoogleSignup(`${forged}.${mac}`, now)).toBeNull();
    expect(readGoogleSignup(`${data}.${mac}`, now + 31 * 60_000)).toBeNull();
  });
});
