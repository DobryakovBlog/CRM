import { db } from "@/db";
import { botToken, handleUpdate, telegramApi, webhookSecret, type TgUpdate } from "@/server/telegram";

export async function POST(request: Request) {
  const token = botToken();
  if (!token || request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret(token)) {
    return new Response("forbidden", { status: 403 });
  }
  const update = (await request.json().catch(() => null)) as TgUpdate | null;
  if (update) {
    try {
      await handleUpdate(db, update, telegramApi(token));
    } catch (err) {
      // Answer 200 anyway so Telegram does not retry the same update forever.
      console.error("[telegram] update failed", err);
    }
  }
  return Response.json({ ok: true });
}
