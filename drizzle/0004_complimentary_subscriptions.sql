ALTER TYPE "public"."subscription_status" ADD VALUE 'complimentary';--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "note" text DEFAULT '' NOT NULL;