import { PrismaClient } from '@prisma/client';
 
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function connect() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma conectado ao PostgreSQL");
  } catch (err) {
    console.error("❌ Erro ao conectar no PostgreSQL:", err);
    process.exit(1);
  }
}
 
export default prisma;