import prisma from "../config/database.js";

async function create({ ip, domain, domains, hostnames, country, city,os, ports, services, asn, org }) {
  const createdIP = await prisma.iPAddress.create({
    data: { ip,domain, domains, hostnames, country, city, os, ports, services , asn, org},
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

async function update({ id, ip, domain, domains, hostnames, country, city,os, ports, services, asn, org }) {
  if (!id) {
    throw new Error("É necessário fornecer o ID para atualizar o registro");
  }
  
  const updatedIP = await prisma.iPAddress.update({
    where: { id },
    data: { ip, domain, domains, hostnames, country, city,os, ports, services, asn, org },
  });

  return updatedIP;
}

async function readByDomain(domain) {
  await prisma.iPAddress.findMany({
  where: {
    domains: {
      has: domain
    }
  }
})};


async function remove(id) {
  await prisma.iPAddress.delete({ where: { id } });
}

export default { create, readAll, readById, readByIP, readByDomain, update, remove };