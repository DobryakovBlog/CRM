import { and, asc, desc, eq, exists, gte, ilike, or, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { salons, services, staff, staffServices, subscriptions } from "@/db/schema";

export type Category = (typeof services.category.enumValues)[number];
export const CATEGORIES = services.category.enumValues;

/**
 * A salon is listed only when it is approved, has a running subscription or trial,
 * and offers at least one bookable service (active service with an active master).
 */
export function listedCondition(now = new Date()) {
  return and(
    eq(salons.kind, "salon"),
    eq(salons.status, "active"),
    exists(
      sql`(select 1 from ${subscriptions} where ${subscriptions.salonId} = ${salons.id}
        and ${subscriptions.status} in ('trial', 'active')
        and ${subscriptions.currentPeriodEnd} >= ${now})`,
    ),
    exists(
      sql`(select 1 from ${services}
        join ${staffServices} on ${staffServices.serviceId} = ${services.id}
        join ${staff} on ${staff.id} = ${staffServices.staffId}
        where ${services.salonId} = ${salons.id} and ${services.isActive} and ${staff.isActive})`,
    ),
  );
}

export type SearchParams = {
  city?: string;
  category?: Category;
  q?: string;
  language?: string; // a master in the salon speaks this language
  minRating?: number; // 1..5
};

export async function searchSalons(db: Db, p: SearchParams) {
  const conds = [listedCondition()];
  if (p.city) conds.push(eq(salons.city, p.city));
  if (p.q) {
    const like = `%${p.q}%`;
    conds.push(or(ilike(salons.name, like), ilike(salons.district, like), ilike(salons.description, like))!);
  }
  if (p.category) {
    conds.push(
      exists(
        sql`(select 1 from ${services} where ${services.salonId} = ${salons.id}
          and ${services.isActive} and ${services.category} = ${p.category})`,
      ),
    );
  }
  if (p.language) {
    conds.push(
      exists(
        sql`(select 1 from ${staff} where ${staff.salonId} = ${salons.id}
          and ${staff.isActive} and ${p.language} = any(${staff.languages}))`,
      ),
    );
  }
  if (p.minRating) conds.push(gte(salons.ratingAvg, p.minRating * 100));

  return db
    .select({
      id: salons.id,
      slug: salons.slug,
      name: salons.name,
      city: salons.city,
      district: salons.district,
      address: salons.address,
      coverImageUrl: salons.coverImageUrl,
      ratingAvg: salons.ratingAvg,
      ratingCount: salons.ratingCount,
      // Written with explicit table names: Drizzle leaves columns unqualified in the
      // select list of a single-table query, which would bind "id" to services.id here.
      minPriceCents: sql<number>`(select min(s.price_cents) from services s
        where s.salon_id = "salons"."id" and s.is_active)`.mapWith(Number),
    })
    .from(salons)
    .where(and(...conds))
    .orderBy(desc(salons.ratingAvg), desc(salons.ratingCount), asc(salons.name))
    .limit(50);
}

export async function salonBySlug(db: Db, slug: string, { onlyListed = true } = {}) {
  const [salon] = await db
    .select()
    .from(salons)
    .where(onlyListed ? and(eq(salons.slug, slug), listedCondition()) : eq(salons.slug, slug));
  if (!salon) return null;

  const [serviceRows, staffRows, links] = await Promise.all([
    db
      .select()
      .from(services)
      .where(and(eq(services.salonId, salon.id), eq(services.isActive, true)))
      .orderBy(asc(services.category), asc(services.priceCents)),
    db
      .select()
      .from(staff)
      .where(and(eq(staff.salonId, salon.id), eq(staff.isActive, true)))
      .orderBy(asc(staff.name)),
    db
      .select({ staffId: staffServices.staffId, serviceId: staffServices.serviceId })
      .from(staffServices)
      .innerJoin(staff, eq(staff.id, staffServices.staffId))
      .where(eq(staff.salonId, salon.id)),
  ]);
  return { salon, services: serviceRows, staff: staffRows, links };
}

/** Cities that currently have at least one listed salon. */
export async function listedCities(db: Db) {
  const rows = await db
    .selectDistinct({ city: salons.city })
    .from(salons)
    .where(listedCondition())
    .orderBy(asc(salons.city));
  return rows.map((r) => r.city);
}
