// Usage: npm run make-admin -- someone@example.com
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("usage: npm run make-admin -- <email>");
const rows = await db.update(users).set({ isAdmin: true }).where(eq(users.email, email)).returning();
console.log(rows.length ? `${email} is now a platform moderator` : `no user ${email}`);
process.exit(0);
