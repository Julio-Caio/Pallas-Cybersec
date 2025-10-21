const ipWhoisBaseURL = 'https://ipwho.is';


/**
 * Resolve o IP de um domínio (DNS A record)
 */

export async function getPublicIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (err) {
    console.error("Não foi possível obter o IP público:", err);
    return null;
  }
}


export async function getDomainNameServer(domain) {
  try {
    // Usa o DNS público do Google para resolver o IP
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const data = await res.json();

    if (!data.Answer || data.Answer.length === 0) {
      throw new Error('Nenhum registro A encontrado para o domínio.');
    }

    // Pega o primeiro IP retornado
    const ip = data.Answer.find(a => a.type === 1)?.data;
    if (!ip) throw new Error('Falha ao resolver o IP.');

    console.log(`🔍 IP resolvido para ${domain}: ${ip}`);
    return ip;
  } catch (err) {
    console.error(`Erro ao resolver o domínio ${domain}:`, err);
    throw err;
  }
}

/**
 * Consulta dados WHOIS e geolocalização de um IP
 */
export function getIPWhoisInfo(baseURL, ip) {
  return fetch(`${baseURL}/${ip}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        return {
          ip: data.ip,
          type: data.type,
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.connection?.isp || data.isp,
          city: data.city,
          region: data.region,
          country: data.country
        };
      } else {
        throw new Error('Falha ao obter dados de geolocalização');
      }
    });
}

/**
 * Função principal para pegar geolocalização de um IP ou domínio
 */
export async function getIPGeolocation(input) {
  try {
    // Se for domínio, resolve para IP primeiro
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ip = ipRegex.test(input) ? input : await getDomainNameServer(input);

    // Busca info de geolocalização
    const geoInfo = await getIPWhoisInfo(ipWhoisBaseURL, ip);

    console.log(`🌍 ${ip} - ${geoInfo.city}, ${geoInfo.country} (${geoInfo.latitude}, ${geoInfo.longitude})`);
    return geoInfo;
  } catch (error) {
    console.error('Erro ao buscar geolocalização:', error);
    throw error;
  }
}

export async function getCoordinates(input) {
  try {
    const geoInfo = await getIPGeolocation(input);
    
    if (geoInfo.latitude != null && geoInfo.longitude != null) {
      return {
        latitude: geoInfo.latitude,
        longitude: geoInfo.longitude
      };
    } else {
      throw new Error('Coordenadas não disponíveis para este IP/domínio.');
    }
  } catch (err) {
    console.error('Erro ao obter coordenadas:', err);
    return null;
  }
}

export async function getCoordinatesMyIP(ip) {
  try {
    const geoInfo = await getIPWhoisInfo(ipWhoisBaseURL, ip);
    
    if (geoInfo.latitude != null && geoInfo.longitude != null) {
      return {
        latitude: geoInfo.latitude,
        longitude: geoInfo.longitude
      };
    } else {
      throw new Error('Coordenadas não disponíveis para este IP.');
    }
  } catch (err) {
    console.error('Erro ao obter coordenadas do meu IP:', err);
    return null;
  }
}