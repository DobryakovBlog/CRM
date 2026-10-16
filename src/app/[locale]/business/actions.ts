"use server";

import { getLocale } from "next-intl/server";
import { z } from "zod";
import { isPlace } from "@/lib/cities";
import { db } from "@/db";
import { redirect } from "@/i18n/navigation";
import { endSession, registerSalonOwner, startSession } from "@/server/auth";
import { cookies } from "next/headers";
import { GOOGLE_SIGNUP_COOKIE, readGoogleSignup } from "@/server/google";

const Register = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8).max(200),
  salonName: z.string().trim().min(2).max(100),
  city: z.string().refine(isPlace),
  address: z.string().trim().min(4).max(200),
  phone: z.string().trim().min(6).max(30),
  kind: z.enum(["salon", "restaurant"]).default("salon"),
});

export async function registerAction(form: FormData) {
  const locale = await getLocale();
  const jar = await cookies();
  // Signed up with Google: the e-mail is the verified one and no password is needed.
  const google = readGoogleSignup(jar.get(GOOGLE_SIGNUP_COOKIE)?.value);
  const fields = Object.fromEntries(form);
  const parsed = (google ? Register.omit({ email: true, password: true }) : Register).safeParse(fields);
  if (!parsed.success) return redirect({ href: `/business/register?error=invalid${google ? "&google=1" : ""}`, locale });
  let userId: string;
  try {
    ({ user: { id: userId } } = await registerSalonOwner(db, {
      ...(parsed.data as z.infer<typeof Register>),
      ...(google ? { email: google.email, password: undefined } : {}),
      petFriendly: form.get("petFriendly") === "on",
    }));
  } catch (e) {
    if (e instanceof Error && e.message === "email_taken") {
      return redirect({ href: "/business/register?error=email_taken", locale });
    }
    throw e;
  }
  if (google) jar.delete(GOOGLE_SIGNUP_COOKIE);
  await startSession(userId);
  redirect({ href: "/business/profile?welcome=1", locale });
}

export async function logoutAction() {
  await endSession();
  redirect({ href: "/business", locale: await getLocale() });
}
