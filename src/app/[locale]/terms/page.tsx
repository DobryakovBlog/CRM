import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/LegalPage";
import { toLocale } from "@/i18n/routing";
import { termsOfUse } from "@/lib/legal";

const lang = toLocale;

export async function generateMetadata({ params }: PageProps<"/[locale]/terms">): Promise<Metadata> {
  return { title: termsOfUse(lang((await params).locale)).title };
}

export default async function Page({ params }: PageProps<"/[locale]/terms">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc={termsOfUse(lang(locale))} />;
}
