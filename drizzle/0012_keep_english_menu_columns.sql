-- An earlier build of this branch dropped these columns; the live site still reads them until
-- this branch is merged. No-op where they still exist. Their texts already live in translations.
ALTER TABLE "menu_sections" ADD COLUMN IF NOT EXISTS "name_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "name_en" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "description_en" text DEFAULT '' NOT NULL;
