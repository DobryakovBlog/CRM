import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Vercel previews share the production database, so only production deploys may change it.
if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
  console.log(`skipping migrations on a ${process.env.VERCEL_ENV} deploy`);
  process.exit(0);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
await pool.end();
console.log("migrations applied");
