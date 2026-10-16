// Telegram bot that answers clients and businesses; empty hides the support links.
export const SUPPORT_TELEGRAM_BOT = "";

export function supportUrl(): string | null {
  return SUPPORT_TELEGRAM_BOT ? `https://t.me/${SUPPORT_TELEGRAM_BOT}` : null;
}
