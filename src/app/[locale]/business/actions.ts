"use server";

import { getLocale } from "next-intl/server";
import { z } from "zod";
import { CITY_SLUGS } from "@/lib/cities";
import { db } from "@/db";
import { redirect } from "@/i18n/navigation";
import { salons } from "@/db/schema";
import { cabinetHome, endSession, registerSalonOwner, startSession, verifyCredentials } from "@/server/auth";
import { eq } from "drizzle-orm";

const Register = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(200),
  salonName: z.string().trim().min(2).max(100),
  city: z.enum(CITY_SLUGS as [string, ...string[]]),
  address: z.string().trim().min(4).max(200),
  phone: z.string().trim().min(6).max(30),
  kind: z.enum(["salon", "barbershop", "restaurant"]).default("salon"),
});

export async function registerAction(form: FormData) {
  const locale = await getLocale();
  const parsed = Register.safeParse(Object.fromEntries(form));
  if (!parsed.success) return redirect({ href: "/business/register?error=invalid", locale });
  let userId: string;
  try {
    ({ user: { id: userId } } = await registerSalonOwner(db, {
      ...parsed.data,
      kind: parsed.data.kind === "restaurant" ? "restaurant" : "salon",
    }));
  } catch (e) {
    if (e instanceof Error && e.message === "email_taken") {
      return redirect({ href: "/business/register?error=email_taken", locale });
    }
    throw e;
  }
  await startSession(userId);
  redirect({ href: "/business/profile?welcome=1", locale });
}

export async function loginAction(form: FormData) {
  const locale = await getLocale();
  const user = await verifyCredentials(db, String(form.get("email") ?? ""), String(form.get("password") ?? ""));
  if (!user) return redirect({ href: "/business/login?error=1", locale });
  await startSession(user.id);
  const [salon] = await db.select({ kind: salons.kind }).from(salons).where(eq(salons.ownerId, user.id));
  redirect({ href: cabinetHome(salon?.kind ?? "salon"), locale });
}

export async function logoutAction() {
  await endSession();
  redirect({ href: "/business", locale: await getLocale() });
}
