import QRCode from "qrcode";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrintButton } from "@/components/PrintButton";
import { Logo } from "@/components/Logo";
import { siteOrigin } from "@/lib/origin";
import { requireOwner } from "@/server/auth";

export default async function QrPage({ params }: PageProps<"/[locale]/business/qr">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { salon } = await requireOwner(locale, "restaurant");
  const t = await getTranslations("business.qr");
  // No locale in the link: each guest gets the menu in their phone's language.
  const url = `${await siteOrigin()}/restaurant/${salon.slug}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#2a2230", light: "#ffffff" } });

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-2">
        <p className="max-w-xl text-sm text-muted">{t("hint")}</p>
        {salon.status !== "active" && <p className="notice">{t("notListed")}</p>}
        <p className="break-all text-sm">
          <a href={url} className="text-gold-deep underline">{url}</a>
        </p>
      </div>

      {/* The table card: prints alone on an A4/A5 sheet. */}
      <div id="qr-card" className="mx-auto max-w-sm space-y-5 rounded-md border border-line bg-white p-8 text-center print:max-w-none print:border-0">
        <div className="flex justify-center">
          <Logo className="h-10 w-auto" />
        </div>
        <p className="font-display text-3xl leading-tight">{salon.name}</p>
        <div className="mx-auto w-56" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="eyebrow">{t("scan")}</p>
        <p className="text-xs text-muted">{t("scanEn")}</p>
      </div>

      <div className="flex justify-center print:hidden">
        <PrintButton label={t("print")} />
      </div>
    </div>
  );
}
