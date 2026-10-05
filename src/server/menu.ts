import { and, asc, eq, exists, ilike, or, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { menuItems, menuSections, salons, subscriptions } from "@/db/schema";

// The 14 allergens restaurants must declare in the EU (Regulation 1169/2011, Annex II).
export const ALLERGENS = [
  "gluten",
  "crustaceans",
  "eggs",
  "fish",
  "peanuts",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphites",
  "lupin",
  "molluscs",
] as const;
export const DISH_TAGS = ["vegetarian", "vegan", "gluten_free", "spicy"] as const;

/** A restaurant is listed when it is approved, paid or on trial, and its menu has a dish. */
export function restaurantListedCondition(now = new Date()) {
  return and(
    eq(salons.kind, "restaurant"),
    eq(salons.status, "active"),
    exists(
      sql`(select 1 from ${subscriptions} where ${subscriptions.salonId} = ${salons.id}
        and ${subscriptions.status} in ('trial', 'active')
        and ${subscriptions.currentPeriodEnd} >= ${now})`,
    ),
    exists(sql`(select 1 from ${menuItems} where ${menuItems.salonId} = ${salons.id} and ${menuItems.isAvailable})`),
  );
}

export async function searchRestaurants(db: Db, p: { city?: string; q?: string }) {
  const conds = [restaurantListedCondition()];
  if (p.city) conds.push(eq(salons.city, p.city));
  if (p.q) {
    const like = `%${p.q}%`;
    conds.push(or(ilike(salons.name, like), ilike(salons.cuisine, like), ilike(salons.district, like))!);
  }
  return db
    .select({
      id: salons.id,
      slug: salons.slug,
      name: salons.name,
      city: salons.city,
      district: salons.district,
      cuisine: salons.cuisine,
      dishes: sql<number>`(select count(*) from menu_items m
        where m.salon_id = "salons"."id" and m.is_available)`.mapWith(Number),
      minPriceCents: sql<number>`(select min(m.price_cents) from menu_items m
        where m.salon_id = "salons"."id" and m.is_available)`.mapWith(Number),
    })
    .from(salons)
    .where(and(...conds))
    .orderBy(asc(salons.name))
    .limit(50);
}

export async function listedRestaurantCities(db: Db) {
  const rows = await db
    .selectDistinct({ city: salons.city })
    .from(salons)
    .where(restaurantListedCondition())
    .orderBy(asc(salons.city));
  return rows.map((r) => r.city);
}

/** Sections with their dishes, in display order. Public view hides unavailable dishes and empty sections. */
export async function restaurantMenu(db: Db, salonId: string, { publicView = true } = {}) {
  const [sections, items] = await Promise.all([
    db
      .select()
      .from(menuSections)
      .where(eq(menuSections.salonId, salonId))
      .orderBy(asc(menuSections.position), asc(menuSections.createdAt)),
    db
      .select()
      .from(menuItems)
      .where(publicView ? and(eq(menuItems.salonId, salonId), eq(menuItems.isAvailable, true)) : eq(menuItems.salonId, salonId))
      .orderBy(asc(menuItems.position), asc(menuItems.createdAt)),
  ]);
  return sections
    .map((s) => ({ ...s, items: items.filter((i) => i.sectionId === s.id) }))
    .filter((s) => !publicView || s.items.length > 0);
}

export async function restaurantBySlug(db: Db, slug: string, { onlyListed = true } = {}) {
  const [restaurant] = await db
    .select()
    .from(salons)
    .where(
      onlyListed
        ? and(eq(salons.slug, slug), restaurantListedCondition())
        : and(eq(salons.slug, slug), eq(salons.kind, "restaurant")),
    );
  if (!restaurant) return null;
  return { restaurant, sections: await restaurantMenu(db, restaurant.id) };
}

// --- Cabinet: editing the menu ----------------------------------------------

async function nextPosition(db: Db, table: typeof menuSections | typeof menuItems, where: ReturnType<typeof eq>) {
  const [row] = await db
    .select({ max: sql<number>`coalesce(max(${table.position}), -1)`.mapWith(Number) })
    .from(table)
    .where(where);
  return row.max + 1;
}

export async function addSection(db: Db, salonId: string, input: { name: string; nameEn: string }) {
  const position = await nextPosition(db, menuSections, eq(menuSections.salonId, salonId));
  const [s] = await db.insert(menuSections).values({ salonId, ...input, position }).returning();
  return s;
}

export async function updateSection(db: Db, salonId: string, sectionId: string, input: { name: string; nameEn: string }) {
  await db.update(menuSections).set(input).where(and(eq(menuSections.id, sectionId), eq(menuSections.salonId, salonId)));
}

export async function deleteSection(db: Db, salonId: string, sectionId: string) {
  await db.delete(menuSections).where(and(eq(menuSections.id, sectionId), eq(menuSections.salonId, salonId)));
}

export type DishInput = {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  priceCents: number;
  portion: string;
  allergens: string[];
  tags: string[];
};

const clean = (input: DishInput): DishInput => ({
  ...input,
  allergens: input.allergens.filter((a) => (ALLERGENS as readonly string[]).includes(a)),
  tags: input.tags.filter((t) => (DISH_TAGS as readonly string[]).includes(t)),
});

export async function addDish(db: Db, salonId: string, sectionId: string, input: DishInput) {
  const [section] = await db
    .select({ id: menuSections.id })
    .from(menuSections)
    .where(and(eq(menuSections.id, sectionId), eq(menuSections.salonId, salonId)));
  if (!section) throw new Error("not_found");
  const position = await nextPosition(db, menuItems, eq(menuItems.sectionId, sectionId));
  const [d] = await db
    .insert(menuItems)
    .values({ salonId, sectionId, ...clean(input), position })
    .returning();
  return d;
}

export async function updateDish(db: Db, salonId: string, dishId: string, input: DishInput) {
  await db.update(menuItems).set(clean(input)).where(and(eq(menuItems.id, dishId), eq(menuItems.salonId, salonId)));
}

export async function setDishAvailable(db: Db, salonId: string, dishId: string, isAvailable: boolean) {
  await db.update(menuItems).set({ isAvailable }).where(and(eq(menuItems.id, dishId), eq(menuItems.salonId, salonId)));
}

export async function deleteDish(db: Db, salonId: string, dishId: string) {
  await db.delete(menuItems).where(and(eq(menuItems.id, dishId), eq(menuItems.salonId, salonId)));
}

/** Swaps a section or dish with its neighbour above or below. */
export async function moveEntry(db: Db, salonId: string, kind: "section" | "dish", id: string, dir: -1 | 1) {
  await db.transaction(async (tx) => {
    const table = kind === "section" ? menuSections : menuItems;
    const [row] = await tx
      .select()
      .from(table)
      .where(and(eq(table.id, id), eq(table.salonId, salonId)));
    if (!row) return;
    const scope =
      kind === "section"
        ? eq(menuSections.salonId, salonId)
        : eq(menuItems.sectionId, (row as typeof menuItems.$inferSelect).sectionId);
    // Normalise positions first so neighbours are always one apart.
    const siblings = await tx
      .select({ id: table.id })
      .from(table)
      .where(scope)
      .orderBy(asc(table.position), asc(table.createdAt));
    const i = siblings.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= siblings.length) return;
    [siblings[i], siblings[j]] = [siblings[j], siblings[i]];
    for (const [position, s] of siblings.entries()) {
      await tx.update(table).set({ position }).where(eq(table.id, s.id));
    }
  });
}

export async function menuHasDishes(db: Db, salonId: string) {
  const [row] = await db.select({ id: menuItems.id }).from(menuItems).where(eq(menuItems.salonId, salonId)).limit(1);
  return Boolean(row);
}

