import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

export async function connect() {
    try {
      await prisma.$connect();
      console.log("✅ Prisma conectado ao PostgreSQL");
      return;
    } catch (err) {
      console.warn(
        `⚠️ Falha ao conectar ao PostgreSQL`
      );
  }
}

export default prisma;