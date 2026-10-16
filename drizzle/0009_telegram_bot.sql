CREATE TABLE "telegram_chats" (
	"chat_id" bigint PRIMARY KEY NOT NULL,
	"lang" text,
	"name" text DEFAULT '' NOT NULL,
	"username" text DEFAULT '' NOT NULL,
	"last_ack_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_relays" (
	"support_message_id" bigint PRIMARY KEY NOT NULL,
	"user_chat_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
