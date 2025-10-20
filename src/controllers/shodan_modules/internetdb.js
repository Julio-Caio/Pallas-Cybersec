const InternetDBAPI = 'https://internetdb.shodan.io';

/**
 * Retorna um objeto com as chaves:
 * { ip, cpes, hostnames, ports, tags, vulns }
 * Lança erro em caso de falha.
 */
export async function getInternetDB(ip) {
  if (!ip || typeof ip !== 'string') {
    throw new TypeError('Parâmetro "ip" inválido.');
  }

  try {
    const response = await fetch(`${InternetDBAPI}/${encodeURIComponent(ip)}`);

    if (!response.ok) {
      let bodyText = '';
      try { bodyText = await response.text(); } catch {}
      throw new Error(
        `InternetDB retornou status ${response.status} ${response.statusText} ${bodyText ? `- ${bodyText}` : ''}`
      );
    }

    const d = await response.json();

    return {
      ip: d.ip ?? ip,
      cpes: Array.isArray(d.cpes) ? d.cpes : [],
      hostnames: Array.isArray(d.hostnames) ? d.hostnames : [],
      ports: Array.isArray(d.ports) ? d.ports : [],
      tags: Array.isArray(d.tags) ? d.tags : [],
      vulns: Array.isArray(d.vulns) ? d.vulns : []
    };
  } catch (err) {
    console.error(`[getInternetDB] erro ao buscar ${ip}:`, err.message || err);
    throw err;
  }
}