// Usage: npm run make-admin -- someone@example.com
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { customers, users } from "@/db/schema";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("usage: npm run make-admin -- <email>");
// Either kind of account can be admin: a business owner or a plain client account.
const owners = await db.update(users).set({ isAdmin: true }).where(eq(users.email, email)).returning();
const clients = await db.update(customers).set({ isAdmin: true }).where(eq(customers.email, email)).returning();
console.log(owners.length + clients.length ? `${email} is now a platform moderator` : `no account ${email}`);
process.exit(0);
