import type { NextRequest } from "next/server";
import { db } from "@/db";
import { anonymiseInactiveClients } from "@/server/retention";

// Daily from Vercel Cron (vercel.json). Vercel sends "Authorization: Bearer $CRON_SECRET".
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return new Response("CRON_SECRET is not set", { status: 503 });
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return new Response("Unauthorized", { status: 401 });
  const result = await anonymiseInactiveClients(db);
  console.log("[retention]", result);
  return Response.json(result);
}
