/**
 * Normaliza um match do Shodan em um objeto consistente
 * @param {Object} match
 * @returns {Object}
 */
function normalizeHost(match) {
  return {
    ip: match.ip_str || match.ip || null,
    hostnames: match.hostnames || [],
    domains: match.domains || [],
    transport: match.transport ?? null,
    isp: match.isp || "Desconhecido",
    org: match.org || "Desconhecido",
    info: match.info || "—",
    port: match.port ?? null,
    product: match.product || "—",
    httpServer: match.http?.server || "—",
    location: {
      city: match.location?.city || "—",
      country: match.location?.country_code || "—",
    },
  };
}

/**
 * Converte o resultado do Shodan em um Map (ip → hostObject)
 * @param {Object} shodanResponse
 * @returns {Map<string, Object>}
 */
export function extractHostsMap(shodanResponse) {
  const hostsMap = new Map();

  if (!shodanResponse || !Array.isArray(shodanResponse.matches)) {
    return hostsMap;
  }

  for (const match of shodanResponse.matches) {
    const host = normalizeHost(match);
    if (host.ip) hostsMap.set(host.ip, host);
  }

  return hostsMap;
}

/**
 * Converte o resultado do Shodan em um Array de hosts
 * @param {Object} shodanResponse
 * @returns {Array<Object>}
 */
export function extractHostsArray(shodanResponse) {
  if (!shodanResponse || !Array.isArray(shodanResponse.matches)) {
    return [];
  }

  return shodanResponse.matches
    .map(normalizeHost)
    .filter(h => h.ip); // remove entradas sem IP
}