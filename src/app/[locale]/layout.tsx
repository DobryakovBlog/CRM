import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-bodoni", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { default: t("title"), template: `%s · Beauty Advisor` }, description: t("description") };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={`${bodoni.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <Link href="/" aria-label="Beauty Advisor">
                <Logo />
              </Link>
              <nav className="flex items-center gap-3 text-sm sm:gap-6">
                <Link href="/business" className="hidden text-muted transition-colors hover:text-ink sm:inline">
                  {t("forSalons")}
                </Link>
                <Suspense fallback={<div className="h-8 w-24" />}>
                  <LanguageSwitcher label={t("language")} />
                </Suspense>
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
          <footer className="bg-plum text-gold-soft/80">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
              <div className="space-y-2">
                <Logo inverted />
                <p className="max-w-sm text-sm">{t("footer")}</p>
              </div>
              <div className="flex gap-6 text-sm">
                <Link href="/" className="hover:text-white">{t("forClients")}</Link>
                <Link href="/business" className="hover:text-white">{t("forSalons")}</Link>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
