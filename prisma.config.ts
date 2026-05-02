import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env.production", override: false });

const pool = new Pool({
  connectionString: env("DATABASE_URL"),
});

export default defineConfig({
  schema: "./prisma/schema.prisma",
  engine: "js",
  experimental: {
    adapter: true,
  },
  adapter: async () => new PrismaPg(pool),
  migrations: {
    path: "./prisma/migrations",
  },
} as any);
