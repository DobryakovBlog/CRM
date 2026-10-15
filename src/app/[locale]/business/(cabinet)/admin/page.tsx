import { redirect } from "next/navigation";

// The admin panel moved out of the business cabinet so a client account can be admin too.
export default async function OldAdminPage({ params }: PageProps<"/[locale]/business/admin">) {
  redirect(`/${(await params).locale}/admin`);
}
