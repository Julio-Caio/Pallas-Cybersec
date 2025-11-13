import prisma from "../database/database.js";

async function create({ ip, country, city,os, ports, services }) {
  const createdIP = await prisma.iPAddress.create({
    data: { ip, country, city, os, ports, services },
  });
  return createdIP;
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

async function update({ id, ip, country, city, ports, services }) {
  const updatedIP = await prisma.iPAddress.update({
    where: { id },
    data: { ip, country, city, ports, services },
  });
  return updatedIP;
}

async function remove(id) {
  await prisma.iPAddress.delete({ where: { id } });
}

export default { create, readAll, readById, readByIP, update, remove };