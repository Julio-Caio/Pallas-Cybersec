/**
 * Checa roteadores de um determinado domínio
 * @param {string} domain
 */

export function getRouters(domain) {
  let query = `device:"router" hostname:${domain}`;

  return query;
}