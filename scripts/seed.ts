// Demo data: a few salons and barbershops in Lisbon and Porto so the catalogue is not empty in development.
// Safe to re-run: demos whose login already exists are skipped.
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems, menuSections, salons, services, staff, staffServices, users, workingHours } from "@/db/schema";
import { registerSalonOwner } from "@/server/auth";

type Demo = {
  salon: string; city?: string; district: string; address: string; description: string;
  team: { name: string; title: string; languages: string[] }[];
  menu: { category: "hair" | "barber" | "nails" | "brows_lashes" | "skin"; name: string; minutes: number; euros: number }[];
};

const demos: Demo[] = [
  {
    salon: "Salão Lumière", district: "Chiado", address: "Rua Garrett 12, 1200-204 Lisboa",
    description: "Cabelo e coloração no coração do Chiado.",
    team: [
      { name: "Ana Ribeiro", title: "Colorista", languages: ["pt", "en"] },
      { name: "Marta Sousa", title: "Cabeleireira", languages: ["pt", "es"] },
    ],
    menu: [
      { category: "hair", name: "Corte feminino", minutes: 45, euros: 35 },
      { category: "hair", name: "Coloração raiz", minutes: 90, euros: 55 },
      { category: "hair", name: "Balayage", minutes: 180, euros: 140 },
    ],
  },
  {
    salon: "Nails & Co", district: "Avenidas Novas", address: "Av. da República 50, 1050-196 Lisboa",
    description: "Manicure, pedicure e gel. Falamos inglês e russo.",
    team: [
      { name: "Olena Kovalenko", title: "Nail artist", languages: ["pt", "en", "uk", "ru"] },
      { name: "Joana Lopes", title: "Manicure", languages: ["pt"] },
    ],
    menu: [
      { category: "nails", name: "Manicure clássica", minutes: 45, euros: 18 },
      { category: "nails", name: "Verniz gel", minutes: 60, euros: 25 },
      { category: "nails", name: "Pedicure spa", minutes: 60, euros: 30 },
    ],
  },
  {
    salon: "Olhar Studio", district: "Alfama", address: "Rua dos Remédios 80, 1100-450 Lisboa",
    description: "Sobrancelhas, pestanas e limpeza de pele.",
    team: [{ name: "Inês Carvalho", title: "Lash & brow artist", languages: ["pt", "en", "fr"] }],
    menu: [
      { category: "brows_lashes", name: "Design de sobrancelhas", minutes: 30, euros: 15 },
      { category: "brows_lashes", name: "Extensão de pestanas", minutes: 120, euros: 60 },
      { category: "skin", name: "Limpeza de pele", minutes: 60, euros: 45 },
    ],
  },
  {
    salon: "Barbearia Alfaiate", district: "Bairro Alto", address: "Rua da Rosa 110, 1200-389 Lisboa",
    description: "Barbearia clássica: corte, barba à navalha e toalha quente.",
    team: [
      { name: "Rui Matos", title: "Barbeiro", languages: ["pt", "en"] },
      { name: "Diogo Pires", title: "Barbeiro", languages: ["pt", "es"] },
    ],
    menu: [
      { category: "barber", name: "Corte masculino", minutes: 30, euros: 18 },
      { category: "barber", name: "Barba à navalha", minutes: 30, euros: 14 },
      { category: "barber", name: "Corte e barba", minutes: 60, euros: 28 },
    ],
  },
  {
    salon: "Ribeira Barber Club", city: "porto", district: "Ribeira", address: "Rua de São João 45, 4050-552 Porto",
    description: "Barbearia no centro histórico do Porto. We speak English.",
    team: [{ name: "Tiago Fonseca", title: "Master barber", languages: ["pt", "en", "fr"] }],
    menu: [
      { category: "barber", name: "Corte masculino", minutes: 30, euros: 16 },
      { category: "barber", name: "Fade", minutes: 45, euros: 20 },
      { category: "barber", name: "Corte e barba", minutes: 60, euros: 25 },
    ],
  },
  {
    salon: "Atelier Foz", city: "porto", district: "Foz do Douro", address: "Av. do Brasil 300, 4150-153 Porto",
    description: "Cabelo e unhas junto ao mar.",
    team: [{ name: "Beatriz Lima", title: "Cabeleireira", languages: ["pt", "en"] }],
    menu: [
      { category: "hair", name: "Corte e brushing", minutes: 60, euros: 32 },
      { category: "nails", name: "Manicure gel", minutes: 60, euros: 24 },
    ],
  },
];

for (const [i, d] of demos.entries()) {
  const email = `demo${i + 1}@astrabela.local`;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) continue;
  const { salon } = await registerSalonOwner(db, {
    name: d.team[0].name, email, password: "demo12345", salonName: d.salon,
    city: d.city ?? "lisboa", address: d.address, phone: "+351 210 000 00" + i,
  });
  await db.update(salons).set({ status: "active", district: d.district, description: d.description }).where(eq(salons.id, salon.id));
  const menu = await db.insert(services).values(d.menu.map((m) => ({
    salonId: salon.id, category: m.category, name: m.name, durationMinutes: m.minutes, priceCents: m.euros * 100,
  }))).returning();
  for (const member of d.team) {
    const [s] = await db.insert(staff).values({ salonId: salon.id, ...member }).returning();
    await db.insert(staffServices).values(menu.map((m) => ({ staffId: s.id, serviceId: m.id })));
    // Tuesday to Saturday, 10:00-19:00
    await db.insert(workingHours).values([2, 3, 4, 5, 6].map((weekday) => ({
      staffId: s.id, weekday, startMinute: 600, endMinute: 1140,
    })));
  }
  console.log(`seeded ${d.salon} (login ${email} / demo12345)`);
}
// --- Restaurants with menus ---------------------------------------------------

type Dish = [name: string, nameEn: string, euros: number, description?: string, extra?: { allergens?: string[]; tags?: string[]; portion?: string; descriptionEn?: string }];
type RestaurantDemo = {
  name: string; city: string; district: string; address: string; cuisine: string; description: string; owner: string;
  menu: { section: string; sectionEn: string; dishes: Dish[] }[];
};

const restaurants: RestaurantDemo[] = [
  {
    name: "Taberna do Largo", city: "lisboa", district: "Alfama", address: "Largo do Chafariz de Dentro 8, 1100-139 Lisboa",
    cuisine: "Portuguesa", description: "Petiscos e pratos do dia numa taberna de bairro, com fado às sextas.", owner: "Luísa Antunes",
    menu: [
      { section: "Petiscos", sectionEn: "Small plates", dishes: [
        ["Pão, azeite e azeitonas", "Bread, olive oil and olives", 3.5, "Pão da casa e azeite do Alentejo", { allergens: ["gluten"], tags: ["vegan"], descriptionEn: "House bread and Alentejo olive oil" }],
        ["Pastéis de bacalhau", "Codfish cakes", 6.5, "Quatro unidades", { allergens: ["fish", "eggs", "gluten"], portion: "4 un.", descriptionEn: "Four pieces" }],
        ["Amêijoas à Bulhão Pato", "Clams Bulhão Pato", 14, "Alho, coentros, limão", { allergens: ["molluscs"], descriptionEn: "Garlic, coriander, lemon" }],
        ["Peixinhos da horta", "Tempura green beans", 6, "", { allergens: ["gluten", "eggs"], tags: ["vegetarian"] }],
      ] },
      { section: "Pratos", sectionEn: "Mains", dishes: [
        ["Bacalhau à Brás", "Bacalhau à Brás", 15.5, "Bacalhau desfiado, batata palha, ovo e azeitonas", { allergens: ["fish", "eggs"], descriptionEn: "Shredded cod, straw potatoes, egg and olives" }],
        ["Polvo à lagareiro", "Octopus lagareiro style", 21, "Com batata a murro e grelos", { allergens: ["molluscs"], descriptionEn: "With crushed potatoes and turnip greens" }],
        ["Bitoque", "Bitoque steak", 13.5, "Bife de vaca, ovo estrelado e batata frita", { allergens: ["eggs"], descriptionEn: "Beef steak, fried egg and chips" }],
        ["Arroz de legumes", "Vegetable rice", 12, "", { tags: ["vegan", "gluten_free"] }],
      ] },
      { section: "Sobremesas", sectionEn: "Desserts", dishes: [
        ["Pastel de nata", "Custard tart", 1.8, "", { allergens: ["gluten", "milk", "eggs"] }],
        ["Arroz doce", "Rice pudding", 4.5, "Com canela", { allergens: ["milk", "eggs"], tags: ["vegetarian"], descriptionEn: "With cinnamon" }],
      ] },
      { section: "Bebidas", sectionEn: "Drinks", dishes: [
        ["Vinho da casa, copo", "House wine, glass", 3.5, "Tinto ou branco", { allergens: ["sulphites"], portion: "0,15 l", descriptionEn: "Red or white" }],
        ["Imperial", "Draught beer", 2.2, "", { allergens: ["gluten"], portion: "0,2 l" }],
        ["Água mineral", "Mineral water", 1.8, "", { portion: "0,5 l" }],
      ] },
    ],
  },
  {
    name: "Mar à Vista", city: "porto", district: "Foz do Douro", address: "Av. do Brasil 455, 4150-153 Porto",
    cuisine: "Peixe e marisco", description: "Peixe fresco grelhado e marisco com vista para o Atlântico.", owner: "Henrique Sá",
    menu: [
      { section: "Entradas", sectionEn: "Starters", dishes: [
        ["Sapateira recheada", "Stuffed crab", 18, "", { allergens: ["crustaceans", "eggs", "mustard"] }],
        ["Camarão ao alho", "Garlic prawns", 13, "", { allergens: ["crustaceans"], tags: ["spicy"] }],
      ] },
      { section: "Peixe", sectionEn: "Fish", dishes: [
        ["Robalo grelhado", "Grilled sea bass", 22, "Com legumes salteados", { allergens: ["fish"], tags: ["gluten_free"], descriptionEn: "With sautéed vegetables" }],
        ["Arroz de marisco", "Seafood rice", 26, "Para duas pessoas", { allergens: ["crustaceans", "molluscs", "fish"], portion: "para 2", descriptionEn: "For two" }],
      ] },
    ],
  },
];

for (const [i, r] of restaurants.entries()) {
  const email = `restaurant${i + 1}@astrabela.local`;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) continue;
  const { salon } = await registerSalonOwner(db, {
    name: r.owner, email, password: "demo12345", salonName: r.name, city: r.city, address: r.address,
    phone: "+351 220 000 00" + i, kind: "restaurant",
  });
  await db.update(salons).set({ status: "active", district: r.district, description: r.description, cuisine: r.cuisine }).where(eq(salons.id, salon.id));
  for (const [si, sec] of r.menu.entries()) {
    const [section] = await db.insert(menuSections).values({ salonId: salon.id, name: sec.section, nameEn: sec.sectionEn, position: si }).returning();
    await db.insert(menuItems).values(sec.dishes.map(([name, nameEn, euros, description = "", extra = {}], di) => ({
      salonId: salon.id, sectionId: section.id, name, nameEn, description, descriptionEn: extra.descriptionEn ?? "",
      priceCents: Math.round(euros * 100), portion: extra.portion ?? "", allergens: extra.allergens ?? [], tags: extra.tags ?? [], position: di,
    })));
  }
  console.log(`seeded ${r.name} (login ${email} / demo12345)`);
}
process.exit(0);
