/**
 * Recebe a resposta do Shodan (objeto) e retorna um Map (ip -> hostObject)
 * @param {Object} shodanResponse
 * @returns {Map<string, Object>}
 */

export function extractHostsMap(shodanResponse) {
  const hostsMap = new Map();

  if (!shodanResponse || !Array.isArray(shodanResponse.matches)) {
    return hostsMap;
  }

  for (const match of shodanResponse.matches) {
    const ip = match.ip_str || match.ip || null;
    if (!ip) continue;

    hostsMap.set(ip, {
      ip,
      hostnames: match.hostnames || [],
      domains: match.domains || [],
      transport: match.transport || [],
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
    });
  }

  return hostsMap;
}

export function extractHostsArray(shodanResponse) {
  const hosts = [];

  if (!shodanResponse || !Array.isArray(shodanResponse.matches)) {
    return hosts;
  }

  for (const match of shodanResponse.matches) {
    hosts.push({
      ip: match.ip_str || match.ip,
      hostnames: match.hostnames || [],
      domains: match.domains || [],
      transport: match.transport || null,
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
    });
  }

  return hosts;
}
