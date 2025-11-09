// Filtrar por sistemas operacionais desatualizados

/**
 * Checa sistemas legados desktop para Microsoft
 * @param {string} domain
 */

export function getMicrosoftDesktops(domain) {
  // Windows cliente com EOL conhecido
  const query = `os:"Windows XP",os:"Windows 7",os:"Windows Vista",os:"Windows 2000" hostname:${domain}`;
  return query;
}

/**
 * Checa sistemas legados corporativos (servidores) Microsoft
 * @param {string} domain
 */

export function getMicrosoftServers(domain) {
  const query = `os:"Windows Server 2003",os:"Windows Server 2008",os:"Windows Server 2012" hostname:${domain}`;
  return query;
}