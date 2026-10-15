import { redirect } from "next/navigation";
import { currentOwner } from "./auth";
import { currentCustomer, isAdminCustomer } from "./customers";

/** The platform admin, signed in either as a client account or as a business owner. */
export async function currentAdmin() {
  const owner = await currentOwner();
  if (owner?.user.isAdmin) return { name: owner.user.name, email: owner.user.email };
  const customer = await currentCustomer();
  if (customer && isAdminCustomer(customer)) return { name: customer.name, email: customer.email };
  return null;
}

export async function requireAdmin(locale: string) {
  const admin = await currentAdmin();
  if (!admin) redirect(`/${locale}/account`);
  return admin;
}
