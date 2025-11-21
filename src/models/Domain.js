import prisma from "../config/database.js";

async function create(name) {
  const createdDomain = await prisma.domain.create({
    data: { name },
  });
  return createdDomain;
}
async function readAll() {
  return await prisma.domain.findMany();
}

async function readById(id) {
  return await prisma.domain.findUnique({ where: { id } });
}

async function readByName(name) {
     return await prisma.domain.findUnique({ where: { name } });
}

async function remove(id) {
  await prisma.iPAddress.delete({ where: { id } });
}

export default { create, readAll, readById, readByName, remove };