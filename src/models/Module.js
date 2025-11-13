import prisma from "../database/database.js";

/**
 * Cria um novo módulo
 * @param {Object} data
 * @param {string} data.name - Nome do módulo
 * @param {string} [data.desc] - Descrição opcional
 * @returns {Promise<Object>} - Módulo criado
 */
async function create({ name, desc }) {
  const module = await prisma.module.create({
    data: { name, desc },
  });
  return module;
}

/**
 * Lê um módulo pelo ID
 * @param {string} id - ID do módulo
 * @returns {Promise<Object|null>} - Módulo encontrado ou null
 */
async function read(id) {
  const module = await prisma.module.findUnique({
    where: { id },
    include: { apiKeys: true }, // inclui as API Keys relacionadas
  });
  return module;
}

/**
 * Lista todos os módulos
 * @returns {Promise<Array>} - Lista de módulos
 */
async function readAll() {
  const modules = await prisma.module.findMany({
    include: { apiKeys: true },
    orderBy: { name: "asc" },
  });
  return modules;
}

/**
 * Atualiza um módulo
 * @param {string} id - ID do módulo
 * @param {Object} data - Dados a atualizar
 * @returns {Promise<Object>} - Módulo atualizado
 */
async function update(id, data) {
  const updated = await prisma.module.update({
    where: { id },
    data,
  });
  return updated;
}

/**
 * Remove um módulo
 * @param {string} id - ID do módulo
 * @returns {Promise<Object>} - Módulo removido
 */
async function remove(id) {
  const deleted = await prisma.module.delete({
    where: { id },
  });
  return deleted;
}

export default { create, read, readAll, update, remove };