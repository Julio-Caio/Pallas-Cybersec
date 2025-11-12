import prisma from "../database/database.js";

async function create({name, email, provider, provider_id, password }) {
    const createdUser = await prisma.userAccount.create({
    data: { name, email, provider, provider_id, password },
  });

  return createdUser
}

async function read(where) {
  if (where?.name) {
    where.name = {
      contains: where.name,
    };
  }
 
  const users = await prisma.userAccount.findMany({ where });
 
  if (users.length === 1 && where) {
    return users[0];
  }
 
  return users;
}
 
async function readById(id) {
  const user = await prisma.userAccount.findUnique({
    where: {
      id,
    },
  });
 
  return user;
}
 
async function update({ id, name, email, provider, provider_id, password }) {
  const updatedHost = await prisma.userAccount.update({
    where: {
      id,
    },
    data: { name, email, provider, provider_id, password },
  });
 
  return updatedHost;
}
 
async function remove(id) {
  await prisma.host.delete({
    where: {
      id,
    },
  });
}
 
export default { create, read, readById, update, remove };