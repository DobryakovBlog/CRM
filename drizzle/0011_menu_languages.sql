ALTER TABLE "menu_items" ADD COLUMN "translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_sections" ADD COLUMN "translations" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "menu_language" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "salons" ADD COLUMN "menu_translations" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
UPDATE "menu_sections" SET "translations" = jsonb_build_object('en', jsonb_build_object('name', "name_en")) WHERE "name_en" <> '';--> statement-breakpoint
UPDATE "menu_items" SET "translations" = jsonb_build_object('en', jsonb_build_object('name', "name_en", 'description', "description_en")) WHERE "name_en" <> '' OR "description_en" <> '';--> statement-breakpoint
UPDATE "salons" SET "menu_translations" = '{en}' WHERE "kind" = 'restaurant' AND (
  EXISTS (SELECT 1 FROM "menu_sections" s WHERE s."salon_id" = "salons"."id" AND s."name_en" <> '')
  OR EXISTS (SELECT 1 FROM "menu_items" i WHERE i."salon_id" = "salons"."id" AND (i."name_en" <> '' OR i."description_en" <> ''))
);
