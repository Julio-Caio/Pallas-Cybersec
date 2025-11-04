import hostsMap from "./shodan_extract.js";

/**
 * Lê todos os subdomínios de todos os hosts no Map
 * e retorna um Set (garante unicidade).
 */

function readSubdomains(hostMap) {
  const subdomains = new Set();

  for (const [, host] of hostMap) {
    if (host.hostnames && host.hostnames.length) {
      host.hostnames.forEach((h) => subdomains.add(h));
    }

    if (host.domains && host.domains.length) {
      host.domains.forEach((d) => subdomains.add(d));
    }
  }

  return subdomains;
}

/**
 * Lê todas as portas encontradas nos hosts e retorna um Set.
 * (Ideal para ver todas as portas abertas sem repetição)
 */
function readPorts(hostMap) {
  const ports = new Set();

  for (const [, host] of hostMap) {
    if (host.port) ports.add(host.port);
  }

  return ports;
}

/**
 * Lê os produtos/serviços detectados e retorna um Set único.
 * (Serve para ter uma visão geral do stack tecnológico)
 */
function readProducts(hostMap) {
  const products = new Set();

  for (const [, host] of hostMap) {
    if (host.product && host.product !== "—") {
      products.add(host.product);
    }
  }

  return products;
}

/**
 * Lê os web servers (HTTP servers) e suas versões
 * e retorna um Array (porque pode haver versões repetidas
 * que você queira analisar na frequência).
 */
function readWebServers(hostMap) {
  const webServers = new Set();

  for (const [, host] of hostMap) {
    if (host.httpServer && host.httpServer !== "—") {
      webServers.add(host.httpServer);
    }
  }

  return webServers;
}

/**
 * Lê os sistemas operacionais (quando disponíveis)
 * e retorna um Set, já que você quer listar os tipos distintos.
 */

function readOperatingSystems(hostMap) {
  const osSet = new Set();

  for (const [, host] of hostMap) {
    if (host.info && host.info !== "—") {
      const cleanOS = host.info.replaceAll("(", "").replaceAll(")", "").trim();
      osSet.add(cleanOS);
    }
  }

  return osSet;
}

function readIPs(hostMap) {
  const ipsSet = new Set();
  for (const [, host] of hostMap) {
    if (host.ip && host.ip !== "—") {
      ipsSet.add(host.ip);
    }
  }

  return ipsSet;
}

// Exemplo de uso
console.log("Subdomínios:", Array.from(readSubdomains(hostsMap)));
console.log("Portas abertas:", Array.from(readPorts(hostsMap)));
console.log("Produtos:", Array.from(readProducts(hostsMap)));
console.log("Servidores HTTP:", readWebServers(hostsMap));
console.log("IPs:", readIPs(hostsMap));
console.log(
  "Sistemas Operacionais:",
  Array.from(readOperatingSystems(hostsMap))
);
