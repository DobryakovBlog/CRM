import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/LegalPage";
import { toLocale } from "@/i18n/routing";
import { privacyPolicy } from "@/lib/legal";

const lang = toLocale;

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">): Promise<Metadata> {
  return { title: privacyPolicy(lang((await params).locale)).title };
}

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={privacyPolicy(lang(locale))} />;
}
