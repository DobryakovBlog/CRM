"use server";

import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { redirect } from "@/i18n/navigation";
import { currentCustomer, deleteCustomer, endCustomerSession } from "@/server/customers";

export async function customerLogoutAction() {
  await endCustomerSession();
  redirect({ href: "/account", locale: await getLocale() });
}

export async function deleteCustomerAction() {
  const customer = await currentCustomer();
  if (customer) {
    await endCustomerSession();
    await deleteCustomer(db, customer.id);
  }
  redirect({ href: "/account?deleted=1", locale: await getLocale() });
}
