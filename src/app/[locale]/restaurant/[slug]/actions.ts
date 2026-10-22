"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/db";
import { VISITOR_COOKIE } from "@/lib/visitor";
import { toggleDishLike } from "@/server/menu";

/** Anonymous visitor id kept for a year, so each phone likes a dish once. */
export async function likeDishAction(itemId: string) {
  const jar = await cookies();
  let visitor = jar.get(VISITOR_COOKIE)?.value;
  if (!visitor || !/^[0-9a-f-]{36}$/.test(visitor)) {
    visitor = randomUUID();
    jar.set(VISITOR_COOKIE, visitor, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 365 * 86_400, path: "/" });
  }
  return toggleDishLike(db, itemId, visitor);
}
