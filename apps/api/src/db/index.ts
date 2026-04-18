import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export let db = drizzle({ client: pool });
