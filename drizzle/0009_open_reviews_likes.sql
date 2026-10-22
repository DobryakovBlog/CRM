CREATE TABLE "menu_item_likes" (
	"item_id" uuid NOT NULL,
	"visitor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "menu_item_likes_item_id_visitor_id_pk" PRIMARY KEY("item_id","visitor_id")
);
--> statement-breakpoint
ALTER TABLE "reviews" ALTER COLUMN "booking_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "reviews" ADD COLUMN "customer_id" uuid;--> statement-breakpoint
ALTER TABLE "menu_item_likes" ADD CONSTRAINT "menu_item_likes_item_id_menu_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_customer_idx" ON "reviews" USING btree ("customer_id");--> statement-breakpoint
-- Restaurants now get the same three-month trial as salons.
INSERT INTO "subscriptions" ("salon_id", "status", "current_period_end")
SELECT "id", 'trial', now() + interval '3 months' FROM "salons"
WHERE "kind" = 'restaurant' AND NOT EXISTS (SELECT 1 FROM "subscriptions" s WHERE s."salon_id" = "salons"."id");
