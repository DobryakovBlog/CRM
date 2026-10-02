// Demo data: a few Lisbon salons so the catalogue is not empty in development.
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { salons, services, staff, staffServices, workingHours } from "@/db/schema";
import { registerSalonOwner } from "@/server/auth";

type Demo = {
  salon: string; district: string; address: string; description: string;
  team: { name: string; title: string; languages: string[] }[];
  menu: { category: "hair" | "nails" | "brows_lashes" | "skin"; name: string; minutes: number; euros: number }[];
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
];

for (const [i, d] of demos.entries()) {
  const email = `demo${i + 1}@astrabela.local`;
  const { salon } = await registerSalonOwner(db, {
    name: d.team[0].name, email, password: "demo12345", salonName: d.salon,
    city: "Lisboa", address: d.address, phone: "+351 210 000 00" + i,
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
process.exit(0);
