import prisma from "../config/database.js";

async function create(data) {
  return await prisma.iPAddress.create({ data });
}

async function readAll() {
  return await prisma.iPAddress.findMany();
}

async function readById(id) {
  return await prisma.iPAddress.findUnique({ where: { id } });
}

async function readByIP(ip) {
  return await prisma.iPAddress.findFirst({ where: { ip } });
}

async function update({ id, ...data }) {
  return await prisma.iPAddress.update({
    where: { id },
    data,
  });
}

async function readByDomain(domainName) {
  return await prisma.iPAddress.findMany({
    where: {
      domain: {
        name: domainName
      }
    },
    include: {
      domain: true
    }
  });
}

async function readByDomainID(domainId) {
  return await prisma.iPAddress.findMany({
    where: {
      domain: {
        id: domainId
      }
    },
    include: {
      domain: true
    }
  });
}

async function remove(id) {
  return await prisma.iPAddress.delete({ where: { id } });
}

export default {
  create,
  readAll,
  readById,
  readByIP,
  readByDomain,
  update,
  remove
};