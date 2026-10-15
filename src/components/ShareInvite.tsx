"use client";

import { useState } from "react";

type Labels = { copy: string; copied: string; whatsapp: string; sms: string };

/** Lets the salon send a review invitation itself: copy the message, or open WhatsApp / SMS with it. */
export function ShareInvite({
  text,
  whatsapp,
  phone,
  labels,
}: {
  text: string;
  whatsapp: string | null;
  phone: string;
  labels: Labels;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers: select a hidden textarea and copy from it.
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const encoded = encodeURIComponent(text);
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={copy} className="btn-gold text-xs">
        {copied ? labels.copied : labels.copy}
      </button>
      {whatsapp && (
        <a href={`${whatsapp}?text=${encoded}`} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs">
          {labels.whatsapp}
        </a>
      )}
      {phone && (
        <a href={`sms:${phone.replace(/[^\d+]/g, "")}?body=${encoded}`} className="btn-outline text-xs">
          {labels.sms}
        </a>
      )}
    </div>
  );
}
