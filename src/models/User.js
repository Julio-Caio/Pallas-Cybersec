import prisma from "../database/database.js";

async function create({name, email, provider, provider_id, password }) {
    const createdUser = await prisma.userAccount.create({
    data: { name, email, provider, provider_id, password },
  });

  return createdUser
}

async function readByEmail(email) {
  try {
      const user = await prisma.userAccount.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw new Error("Falha ao buscar usuário");
    }
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
 
export default { create, readByEmail, readById, update, remove };