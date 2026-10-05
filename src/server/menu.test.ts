import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { menuItems, salons } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { submitForReview } from "./cabinet";
import { searchSalons } from "./catalog";
import {
  addDish,
  addSection,
  moveEntry,
  restaurantBySlug,
  restaurantMenu,
  searchRestaurants,
  setDishAvailable,
  updateDish,
  type DishInput,
} from "./menu";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

const dish = (name: string, euros: number, extra: Partial<DishInput> = {}): DishInput => ({
  name,
  nameEn: "",
  description: "",
  descriptionEn: "",
  priceCents: euros * 100,
  portion: "",
  allergens: [],
  tags: [],
  ...extra,
});

let restaurantId: string, slug: string, otherId: string;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons cascade`);
  const owner = { name: "Owner", password: "secret123", address: "Rua 1", phone: "", city: "lisboa" };
  const r = await registerSalonOwner(db, { ...owner, email: "r@test.pt", salonName: "Taberna", kind: "restaurant" });
  const o = await registerSalonOwner(db, { ...owner, email: "o@test.pt", salonName: "Outra Taberna", kind: "restaurant" });
  restaurantId = r.salon.id;
  slug = r.salon.slug;
  otherId = o.salon.id;
});

afterAll(async () => {
  await pool.end();
});

describe("restaurant menu", () => {
  it("is listed only once approved and with a dish, and never among salons", async () => {
    await expect(submitForReview(db, restaurantId)).rejects.toThrow("not_ready");
    const s = await addSection(db, restaurantId, { name: "Pratos", nameEn: "Mains" });
    await addDish(db, restaurantId, s.id, dish("Bitoque", 13.5));
    await submitForReview(db, restaurantId);
    expect(await searchRestaurants(db, { city: "lisboa" })).toHaveLength(0); // pending, not approved yet

    await db.update(salons).set({ status: "active" }).where(eq(salons.id, restaurantId));
    const [found] = await searchRestaurants(db, { city: "lisboa" });
    expect(found).toMatchObject({ slug, dishes: 1, minPriceCents: 1350 });
    expect(await searchSalons(db, { city: "lisboa" })).toHaveLength(0);
  });

  it("hides sold-out dishes and empty sections from guests but not from the owner", async () => {
    const mains = await addSection(db, restaurantId, { name: "Pratos", nameEn: "" });
    const drinks = await addSection(db, restaurantId, { name: "Bebidas", nameEn: "" });
    await addDish(db, restaurantId, mains.id, dish("Bitoque", 13.5));
    const water = await addDish(db, restaurantId, drinks.id, dish("Água", 2));
    await setDishAvailable(db, restaurantId, water.id, false);
    await db.update(salons).set({ status: "active" }).where(eq(salons.id, restaurantId));

    const page = await restaurantBySlug(db, slug);
    expect(page!.sections.map((s) => s.name)).toEqual(["Pratos"]);
    const owner = await restaurantMenu(db, restaurantId, { publicView: false });
    expect(owner.map((s) => s.items.length)).toEqual([1, 1]);
  });

  it("keeps the order the owner sets", async () => {
    const s = await addSection(db, restaurantId, { name: "Pratos", nameEn: "" });
    const a = await addDish(db, restaurantId, s.id, dish("A", 1));
    await addDish(db, restaurantId, s.id, dish("B", 1));
    await addDish(db, restaurantId, s.id, dish("C", 1));
    await moveEntry(db, restaurantId, "dish", a.id, 1);
    const [menu] = await restaurantMenu(db, restaurantId, { publicView: false });
    expect(menu.items.map((d) => d.name)).toEqual(["B", "A", "C"]);
  });

  it("only accepts known allergens and tags, and only from the dish's own restaurant", async () => {
    const s = await addSection(db, restaurantId, { name: "Pratos", nameEn: "" });
    const d = await addDish(db, restaurantId, s.id, dish("Polvo", 21, { allergens: ["molluscs", "nonsense"], tags: ["spicy", "x"] }));
    expect(d.allergens).toEqual(["molluscs"]);
    expect(d.tags).toEqual(["spicy"]);

    await expect(addDish(db, otherId, s.id, dish("Intruso", 1))).rejects.toThrow("not_found");
    await updateDish(db, otherId, d.id, dish("Mudado", 99));
    const [still] = await db.select().from(menuItems).where(eq(menuItems.id, d.id));
    expect(still.name).toBe("Polvo");
  });
});
