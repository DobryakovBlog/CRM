"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Chrome and Edge fire this event when the site can be installed; it is not in the DOM typings.
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const STANDALONE = "(display-mode: standalone)";
const runsAsApp = () =>
  window.matchMedia(STANDALONE).matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
function watchDisplayMode(onChange: () => void) {
  const mq = window.matchMedia(STANDALONE);
  mq.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onChange);
  };
}

/** Phone outline with a down arrow, in the site's line style. */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M12 7v7m-3-3 3 3 3-3M10.5 18.5h3" />
    </svg>
  );
}

/**
 * "Install the app": puts Astrabela on the home screen. Where the browser offers its own install
 * dialog (Chrome, Edge, Samsung Internet) the link opens it; elsewhere, mainly Safari on iPhone,
 * it explains the two taps. Hidden when the site already runs as the installed app.
 */
export function InstallAppLink({
  label,
  hintIos,
  hintOther,
  close,
  className = "",
}: {
  label: string;
  hintIos: string;
  hintOther: string;
  close: string;
  className?: string;
}) {
  // Renders nothing on the server (true there) and inside the installed app.
  const installed = useSyncExternalStore(watchDisplayMode, runsAsApp, () => true);
  const [justInstalled, setJustInstalled] = useState(false);
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => setJustInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || justInstalled) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      setPromptEvent(null);
      return;
    }
    // iPadOS reports itself as a Mac, so a touch-capable "Mac" counts as iOS too.
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
    setHint(ios ? hintIos : hintOther);
  }

  return (
    <>
      <button type="button" onClick={install} className={`inline-flex items-center gap-1.5 ${className}`}>
        <PhoneIcon />
        {label}
      </button>
      {hint && (
        <div role="dialog" aria-label={label} className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-md items-start gap-3 rounded-md bg-white p-4 text-sm text-ink shadow-lg ring-1 ring-black/10">
          <p className="flex-1">{hint}</p>
          <button type="button" onClick={() => setHint(null)} aria-label={close} className="text-lg leading-none text-muted hover:text-ink">
            ×
          </button>
        </div>
      )}
    </>
  );
}
