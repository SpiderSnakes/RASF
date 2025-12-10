import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL manquant dans l'environnement (.env non chargé ?)");
}

export default defineConfig({
  schemas: ["./prisma/schema.prisma"],
  datasource: {
    provider: "postgresql",
    url: databaseUrl,
  },
});

