import { shodanHostnameResults } from "./requests_shodan.js";

const obj1 = await shodanHostnameResults;

if (!obj1 || !Array.isArray(obj1.matches)) {
  console.error("❌ Resultado inválido ou vazio do Shodan:", obj1);
  process.exit(1);
}

const hostsMap = new Map();

for (const match of obj1.matches) {
  hostsMap.set(match.ip_str, {
    ip: match.ip_str,
    hostnames: match.hostnames || [],
    domains: match.domains || [],
    transport: match.transport || [],
    isp: match.isp || "Desconhecido",
    org: match.org || "Desconhecido",
    info: match.info || "—",
    port: match.port || null,
    product: match.product || "—",
    httpServer: match.http?.server || "—",
    location: {
      city: match.location?.city || "—",
      country: match.location?.country_code || "—",
    },
  });
}

console.log("✅ Hosts processados:", hostsMap.size);

export default hostsMap;
