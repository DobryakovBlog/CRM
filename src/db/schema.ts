import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const id = () => uuid("id").primaryKey().defaultRandom();
const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

// Service categories offered by beauty salons (MVP scope: beauty salons only).
export const serviceCategory = pgEnum("service_category", [
  "hair",
  "barber",
  "nails",
  "brows_lashes",
  "skin",
  "makeup",
  "massage",
  "other",
]);

export const bookingStatus = pgEnum("booking_status", [
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

export const bookingSource = pgEnum("booking_source", ["marketplace", "manual", "invitation"]);

// A listed business is either a beauty salon / barbershop (bookings) or a restaurant (menu).
export const businessKind = pgEnum("business_kind", ["salon", "restaurant"]);

export const salonStatus = pgEnum("salon_status", [
  "draft", // owner still filling in the profile
  "pending", // waiting for our review
  "active", // listed on the marketplace
  "suspended",
]);

export const subscriptionPlan = pgEnum("subscription_plan", [
  "monthly", // 12.99 EUR / month
  "semiannual", // 10.99 EUR / month, billed for 6 months
  "annual", // 9.99 EUR / month, billed for 12 months
]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "trial",
  "active",
  "past_due",
  "cancelled",
]);

export const reviewStatus = pgEnum("review_status", ["published", "hidden"]);

// Salon owners and staff who can sign in to the business cabinet.
export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: createdAt(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // sha256 of the cookie token
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const salons = pgTable(
  "salons",
  {
    id: id(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    slug: text("slug").notNull().unique(),
    kind: businessKind("kind").notNull().default("salon"),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    city: text("city").notNull(), // city slug, e.g. "lisboa"
    district: text("district").notNull().default(""), // e.g. "Alfama"
    address: text("address").notNull(),
    postalCode: text("postal_code").notNull().default(""),
    latitude: text("latitude"),
    longitude: text("longitude"),
    phone: text("phone").notNull().default(""),
    email: text("email").notNull().default(""),
    nif: text("nif").notNull().default(""), // Portuguese tax number
    timezone: text("timezone").notNull().default("Europe/Lisbon"),
    coverImageUrl: text("cover_image_url"),
    cuisine: text("cuisine").notNull().default(""), // restaurants only, e.g. "Portuguesa · Marisco"
    status: salonStatus("status").notNull().default("draft"),
    // Cached aggregates, recomputed whenever a review changes.
    ratingAvg: integer("rating_avg_x100").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("salons_city_status_idx").on(t.city, t.status)],
);

export const subscriptions = pgTable("subscriptions", {
  id: id(),
  salonId: uuid("salon_id")
    .notNull()
    .unique()
    .references(() => salons.id, { onDelete: "cascade" }),
  plan: subscriptionPlan("plan").notNull().default("monthly"),
  status: subscriptionStatus("status").notNull().default("trial"),
  currentPeriodEnd: timestamp("current_period_end", {
    withTimezone: true,
  }).notNull(),
  createdAt: createdAt(),
});

export const staff = pgTable("staff", {
  id: id(),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salons.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  title: text("title").notNull().default(""), // e.g. "Colorista"
  bio: text("bio").notNull().default(""),
  languages: text("languages").array().notNull().default(["pt"]),
  photoUrl: text("photo_url"),
  isActive: boolean("is_active").notNull().default(true),
  ratingAvg: integer("rating_avg_x100").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  createdAt: createdAt(),
});

export const services = pgTable("services", {
  id: id(),
  salonId: uuid("salon_id")
    .notNull()
    .references(() => salons.id, { onDelete: "cascade" }),
  category: serviceCategory("category").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  durationMinutes: smallint("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
});

export const staffServices = pgTable(
  "staff_services",
  {
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.staffId, t.serviceId] })],
);

// Weekly schedule. weekday: 0 = Sunday ... 6 = Saturday. Minutes from midnight, local time.
export const workingHours = pgTable("working_hours", {
  id: id(),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  weekday: smallint("weekday").notNull(),
  startMinute: smallint("start_minute").notNull(),
  endMinute: smallint("end_minute").notNull(),
});

// Vacations, breaks and other blocked time.
export const timeOff = pgTable("time_off", {
  id: id(),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  reason: text("reason").notNull().default(""),
});

// A salon's own client base. Belongs to the salon, never shared with other salons.
export const clients = pgTable(
  "clients",
  {
    id: id(),
    salonId: uuid("salon_id")
      .notNull()
      .references(() => salons.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull().default(""),
    phone: text("phone").notNull().default(""),
    notes: text("notes").notNull().default(""),
    marketingConsent: boolean("marketing_consent").notNull().default(false),
    noShowCount: integer("no_show_count").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("clients_salon_email_idx").on(t.salonId, t.email)],
);

export const bookings = pgTable(
  "bookings",
  {
    id: id(),
    salonId: uuid("salon_id")
      .notNull()
      .references(() => salons.id, { onDelete: "cascade" }),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: bookingStatus("status").notNull().default("confirmed"),
    source: bookingSource("source").notNull().default("marketplace"),
    // Secret token in the client's confirmation link (manage booking, leave review).
    manageToken: text("manage_token").notNull().unique(),
    priceCents: integer("price_cents").notNull(),
    clientNote: text("client_note").notNull().default(""),
    locale: text("locale").notNull().default("pt"),
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
    reviewRequestSentAt: timestamp("review_request_sent_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [index("bookings_staff_start_idx").on(t.staffId, t.startsAt)],
);

// Reviews are only possible for a completed booking, so every review is a verified visit.
export const reviews = pgTable(
  "reviews",
  {
    id: id(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    salonId: uuid("salon_id")
      .notNull()
      .references(() => salons.id, { onDelete: "cascade" }),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id),
    rating: smallint("rating").notNull(), // 1..5
    text: text("text").notNull().default(""),
    authorName: text("author_name").notNull(),
    reply: text("reply"),
    repliedAt: timestamp("replied_at", { withTimezone: true }),
    status: reviewStatus("status").notNull().default("published"),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("reviews_booking_unique").on(t.bookingId)],
);

export const reviewReports = pgTable("review_reports", {
  id: id(),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  reporterEmail: text("reporter_email").notNull().default(""),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: createdAt(),
});

// --- Restaurants: menu --------------------------------------------------------

export const menuSections = pgTable(
  "menu_sections",
  {
    id: id(),
    salonId: uuid("salon_id")
      .notNull()
      .references(() => salons.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nameEn: text("name_en").notNull().default(""),
    position: integer("position").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("menu_sections_salon_idx").on(t.salonId)],
);

export const menuItems = pgTable(
  "menu_items",
  {
    id: id(),
    salonId: uuid("salon_id")
      .notNull()
      .references(() => salons.id, { onDelete: "cascade" }),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => menuSections.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    nameEn: text("name_en").notNull().default(""),
    description: text("description").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    priceCents: integer("price_cents").notNull(),
    // Free text like "250 g" or "0,33 l".
    portion: text("portion").notNull().default(""),
    // EU FIC 1169/2011: the 14 allergens, as codes (gluten, milk, eggs, ...).
    allergens: text("allergens").array().notNull().default([]),
    // vegetarian, vegan, spicy, gluten_free
    tags: text("tags").array().notNull().default([]),
    isAvailable: boolean("is_available").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("menu_items_section_idx").on(t.sectionId)],
);
