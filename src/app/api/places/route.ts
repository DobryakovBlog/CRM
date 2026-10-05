import type { NextRequest } from "next/server";
import { db } from "@/db";
import { searchPlaces } from "@/lib/cities";
import { listedCities } from "@/server/catalog";
import { listedRestaurantCities } from "@/server/menu";

// Suggestions for the city field: GET /api/places?q=sint[&for=restaurants]
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 60);
  if (q.trim().length < 2) return Response.json([]);
  const listed =
    request.nextUrl.searchParams.get("for") === "restaurants" ? await listedRestaurantCities(db) : await listedCities(db);
  return Response.json(searchPlaces(q, listed));
}
