import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, type Db } from "@/db";
import { salons, sessions, subscriptions, users } from "@/db/schema";
import { slugify } from "@/lib/slug";

const COOKIE = "ba_session";
const SESSION_DAYS = 30;
export const TRIAL_DAYS = 30;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

/** Creates the owner account, the salon (as draft) and its trial subscription. */
export async function registerSalonOwner(
  database: Db,
  input: {
    name: string;
    email: string;
    password: string;
    salonName: string;
    city: string;
    address: string;
    phone: string;
    kind?: "salon" | "restaurant";
  },
  now = new Date(),
) {
  const email = input.email.trim().toLowerCase();
  return database.transaction(async (tx) => {
    const [existing] = await tx.select({ id: users.id }).from(users).where(eq(users.email, email));
    if (existing) throw new Error("email_taken");

    const [user] = await tx
      .insert(users)
      .values({ email, name: input.name.trim(), passwordHash: await hashPassword(input.password) })
      .returning();

    const base = slugify(`${input.salonName} ${input.city}`) || "salao";
    let slug = base;
    for (let i = 2; ; i++) {
      const [taken] = await tx.select({ id: salons.id }).from(salons).where(eq(salons.slug, slug));
      if (!taken) break;
      slug = `${base}-${i}`;
    }

    const [salon] = await tx
      .insert(salons)
      .values({
        ownerId: user.id,
        slug,
        kind: input.kind ?? "salon",
        name: input.salonName.trim(),
        city: slugify(input.city),
        address: input.address.trim(),
        phone: input.phone.trim(),
        email,
      })
      .returning();

    await tx.insert(subscriptions).values({
      salonId: salon.id,
      status: "trial",
      currentPeriodEnd: new Date(now.getTime() + TRIAL_DAYS * 86_400_000),
    });
    return { user, salon };
  });
}

export async function verifyCredentials(database: Db, email: string, password: string) {
  const [user] = await database.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
  if (!user) return null;
  return (await bcrypt.compare(password, user.passwordHash)) ? user : null;
}

export async function startSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  jar.delete(COOKIE);
}

export async function currentUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, hashToken(token)), gt(sessions.expiresAt, new Date())));
  return row?.user ?? null;
}

/** The signed-in owner and their salon (MVP: one salon per owner). */
export async function currentOwner() {
  const user = await currentUser();
  if (!user) return null;
  const [salon] = await db.select().from(salons).where(eq(salons.ownerId, user.id));
  return salon ? { user, salon } : null;
}

/** Where an owner lands in the cabinet: the calendar for salons, the menu for restaurants. */
export const cabinetHome = (kind: "salon" | "restaurant") => (kind === "restaurant" ? "/business/menu" : "/business/calendar");

/**
 * For cabinet pages and actions: the owner or a redirect to the login page.
 * Pages for one kind of business send the other kind to its own cabinet home.
 */
export async function requireOwner(locale: string, kind?: "salon" | "restaurant") {
  const owner = await currentOwner();
  if (!owner) redirect(`/${locale}/business/login`);
  if (kind && owner.salon.kind !== kind) redirect(`/${locale}${cabinetHome(owner.salon.kind)}`);
  return owner;
}
