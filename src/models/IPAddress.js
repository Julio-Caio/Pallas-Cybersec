import prisma from "../database/database.js";

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

async function update({ ip, domain, domains, hostnames, country, city,os, ports, services, asn, org }) {
  const updatedIP = await prisma.iPAddress.update({
    where: { id },
    data: { ip, domain, domains, hostnames, country, city,os, ports, services, asn, org },
  });
  return updatedIP;
}

async function readByDomain(domain) {
  return await prisma.iPAddress.findMany({ where: {domain}})
}

async function remove(id) {
  await prisma.iPAddress.delete({ where: { id } });
}

export default { create, readAll, readById, readByIP, readByDomain, update, remove };