import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

export async function connect(retries = 5, interval = 2000) {
  while (retries > 0) {
    try {
      await prisma.$connect();
      console.log("✅ Prisma conectado ao PostgreSQL");
      return;
    } catch (err) {
      console.warn(`⚠️ Falha ao conectar. Tentativas restantes: ${retries - 1}`);
      console.warn(err);

      retries--;
      if (retries === 0) break;

      await new Promise(r => setTimeout(r, interval));
    }
  } 

  console.error("❌ Não foi possível conectar após várias tentativas.");
  process.exit(1);
}

export default prisma;