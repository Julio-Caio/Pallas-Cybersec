import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.WHOIS_API_KEY;

/**
 * Faz uma consulta WHOIS via API Ninjas
 * @param {string} domain - domínio para consulta (ex: "google.com")
 * @returns {Promise<Object>} objeto JSON com os dados WHOIS
 */
export async function whoisSearch(domain) {
  const url = `https://api.api-ninjas.com/v1/whois?domain=${encodeURIComponent(domain)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro WHOIS: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Erro ao consultar WHOIS:", err.message);
    return { error: "Falha na requisição WHOIS", details: err.message };
  }
}