import prisma from "../database/database.js";

async function create({ name, ip }) {
  return await prisma.domain.create({
    data: { name, ip },
  });
}

async function readAll() {
  return await prisma.domain.findMany();
}

async function readById(id) {
  return await prisma.domain.findUnique({ where: { id } });
}

async function readByName(name, exact = false) {
  const condition = exact
    ? { equals: name }
    : { contains: name };

  return await prisma.domain.findMany({ where: { name: condition } });
}

async function readLatestByName(name) {
  return await prisma.domain.findFirst({
    where: { name },
    orderBy: { created_at: "desc" },
  });
}

async function update({ id, name, ip, nameserver }) {
  return await prisma.domain.update({
    where: { id },
    data: { name, ip, nameserver },
  });
}

async function remove(id) {
  try {
    await prisma.domain.delete({ where: { id } });
    return { message: "Domain successfully deleted" };
  } catch (err) {
    if (err.code === "P2025") {
      return { error: "Domain not found" };
    }
    throw err;
  }
}

export default {
  create,
  readAll,
  readById,
  readByName,
  readLatestByName,
  update,
  remove,
};
