CREATE TYPE "public"."business_kind" AS ENUM('salon', 'restaurant');--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salon_id" uuid NOT NULL,
	"section_id" uuid NOT NULL,
	"name" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"price_cents" integer NOT NULL,
	"portion" text DEFAULT '' NOT NULL,
	"allergens" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"salon_id" uuid NOT NULL,
	"name" text NOT NULL,
	"name_en" text DEFAULT '' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "kind" "business_kind" DEFAULT 'salon' NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "cuisine" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_section_id_menu_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."menu_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_sections" ADD CONSTRAINT "menu_sections_salon_id_salons_id_fk" FOREIGN KEY ("salon_id") REFERENCES "public"."salons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "menu_items_section_idx" ON "menu_items" USING btree ("section_id");--> statement-breakpoint
CREATE INDEX "menu_sections_salon_idx" ON "menu_sections" USING btree ("salon_id");