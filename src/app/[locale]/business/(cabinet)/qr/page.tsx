import QRCode from "qrcode";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PrintButton } from "@/components/PrintButton";
import { Logo } from "@/components/Logo";
import { siteOrigin } from "@/lib/origin";
import { requireOwner } from "@/server/auth";

export default async function QrPage({ params }: PageProps<"/[locale]/business/qr">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.qr");
  const restaurant = salon.kind === "restaurant";
  // Restaurants and salons get their own wording where it differs.
  const k = (key: string) => (restaurant ? key : `salon.${key}`) as never;
  // No locale in the link: each visitor gets the page in their phone's language.
  const url = `${await siteOrigin()}/${restaurant ? "restaurant" : "salon"}/${salon.slug}`;
  const svg = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#14233c", light: "#ffffff" } });

  return (
    <div className="space-y-6">
      <div className="print:hidden space-y-2">
        <p className="max-w-xl text-sm text-muted">{t(k("hint"))}</p>
        {salon.status !== "active" && <p className="notice">{t(k("notListed"))}</p>}
        <p className="break-all text-sm">
          <a href={url} className="text-gold-deep underline">{url}</a>
        </p>
      </div>

      {/* The table or counter card: prints alone on an A4/A5 sheet. */}
      <div id="qr-card" className="mx-auto max-w-sm space-y-5 rounded-md border border-line bg-white p-8 text-center print:max-w-none print:border-0">
        <div className="flex justify-center">
          <Logo className="h-10 w-auto" />
        </div>
        <p className="font-display text-3xl leading-tight">{salon.name}</p>
        <div className="mx-auto w-56" dangerouslySetInnerHTML={{ __html: svg }} />
        <p className="eyebrow">{t(k("scan"))}</p>
        <p className="text-xs text-muted">{t(k("scanEn"))}</p>
      </div>

      <div className="flex justify-center print:hidden">
        <PrintButton label={t("print")} />
      </div>
    </div>
  );
}
