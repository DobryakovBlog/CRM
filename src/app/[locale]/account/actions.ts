"use server";

import { eq } from "drizzle-orm";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { salons } from "@/db/schema";
import { redirect } from "@/i18n/navigation";
import { safeNext } from "@/lib/next-path";
import { cabinetHome, startSession, verifyCredentials } from "@/server/auth";
import {
  currentCustomer,
  deleteCustomer,
  endCustomerSession,
  isAdminCustomer,
  registerCustomer,
  startCustomerSession,
  verifyCustomer,
} from "@/server/customers";

const withNext = (href: string, next: string) => (next ? `${href}&next=${encodeURIComponent(next)}` : href);

/** One sign-in for everyone: a business owner opens the cabinet, a client their account. */
export async function signInAction(form: FormData) {
  const locale = await getLocale();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const next = safeNext(form.get("next"));

  const user = await verifyCredentials(db, email, password);
  if (user) {
    await startSession(user.id);
    const [salon] = await db.select({ kind: salons.kind }).from(salons).where(eq(salons.ownerId, user.id));
    return redirect({ href: next || cabinetHome(salon?.kind ?? "salon"), locale });
  }
  const customer = await verifyCustomer(db, email, password);
  if (customer) {
    await startCustomerSession(customer.id, customer.name);
    return redirect({ href: next || (isAdminCustomer(customer) ? "/admin" : "/account"), locale });
  }
  redirect({ href: withNext("/account?error=login", next), locale });
}

const Register = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(200),
});

export async function registerCustomerAction(form: FormData) {
  const locale = await getLocale();
  const next = safeNext(form.get("next"));
  const parsed = Register.safeParse(Object.fromEntries(form));
  if (!parsed.success) return redirect({ href: withNext("/account/register?error=invalid", next), locale });
  let customer;
  try {
    customer = await registerCustomer(db, parsed.data);
  } catch (e) {
    if (e instanceof Error && e.message === "email_taken") {
      return redirect({ href: withNext("/account/register?error=email_taken", next), locale });
    }
    throw e;
  }
  await startCustomerSession(customer.id, customer.name);
  redirect({ href: next || (isAdminCustomer(customer) ? "/admin" : "/account?welcome=1"), locale });
}

export async function customerLogoutAction() {
  await endCustomerSession();
  redirect({ href: "/account", locale: await getLocale() });
}

export async function deleteCustomerAction() {
  const customer = await currentCustomer();
  if (customer) {
    await endCustomerSession();
    await deleteCustomer(db, customer.id);
  }
  redirect({ href: "/account?deleted=1", locale: await getLocale() });
}
