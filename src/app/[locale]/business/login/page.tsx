import { redirect } from "next/navigation";

// Business owners use the shared sign-in page.
export default async function BusinessLoginPage({ params }: PageProps<"/[locale]/business/login">) {
  redirect(`/${(await params).locale}/account`);
}
