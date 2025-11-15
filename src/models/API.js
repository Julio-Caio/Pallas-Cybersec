import prisma from "../database/database.js";

async function create({ apiKey, id_user, id_module, status }) {
  const createdAPI = await prisma.apiKey.create({
    data: { apiKey, id_user, id_module, status },
  });
  return createdAPI;
}

async function read(id) {
  const api = await prisma.apiKey.findUnique({
    where: {
      id
    },
  });

  return api;
}

async function readAllByUser(userId) {
  const api = await prisma.apiKey.findMany({
    where: {
      id_user: userId
    },
  });

  return api;
}

async function readByModule(userId, moduleId) {
  const api = await prisma.apiKey.findFirst({
    where: {
      id_user: userId,
      id_module: moduleId,
    },
  });

  return api;
}

async function remove(id) {
  const deleted = await prisma.apiKey.delete({ where: { id } });
  return deleted;
}


export default { create, read, readAllByUser, readByModule, remove };
