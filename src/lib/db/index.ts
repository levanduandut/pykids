import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return drizzle(neon(url), { schema });
}

type Db = ReturnType<typeof getClient>;

let cached: Db | null = null;

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    if (!cached) cached = getClient();
    return Reflect.get(cached, prop);
  },
});
