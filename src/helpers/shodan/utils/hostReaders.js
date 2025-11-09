import { extractHostsMap } from "../services/shodanExtract.js";
import { getFTPServers } from "../services/apps/getApps.js"
import { shodanSearch } from '../services/search.js'

export function readSubdomains(hostMap) {
  const subdomains = new Set();
  for (const [, host] of hostMap) {
    (host.hostnames || []).forEach(h => subdomains.add(h));
    (host.domains || []).forEach(d => subdomains.add(d));
  }
  return subdomains;
}

export function readPorts(hostMap) {
  const ports = new Set();
  for (const [, host] of hostMap) {
    if (host.port) ports.add(host.port);
  }
  return ports;
}

export function readProducts(hostMap) {
  const products = new Set();
  for (const [, host] of hostMap) {
    if (host.product && host.product !== "—") products.add(host.product);
  }
  return products;
}

export function readWebServers(hostMap) {
  const webServers = new Set();
  for (const [, host] of hostMap) {
    if (host.httpServer && host.httpServer !== "—") webServers.add(host.httpServer);
  }
  return webServers;
}

export function readOperatingSystems(hostMap) {
  const osSet = new Set();
  for (const [, host] of hostMap) {
    if (host.info && host.info !== "—") {
      const clean = host.info.replaceAll("(", "").replaceAll(")", "").trim();
      osSet.add(clean);
    }
  }
  return osSet;
}

export function readIPs(hostMap) {
  const ipsSet = new Set();
  for (const [, host] of hostMap) {
    if (host.ip && host.ip !== "—") ipsSet.add(host.ip);
  }
  return ipsSet;
}

// Testes
const search = await shodanSearch(getFTPServers('.com.br'))
const extract = extractHostsMap(search)
console.log(extract)
let result = readProducts(extract)
console.log(result)
result = readPorts(extract)
console.log(result)
result = readIPs(extract)
console.log(result)
result = readSubdomains(extract)
console.log(result)