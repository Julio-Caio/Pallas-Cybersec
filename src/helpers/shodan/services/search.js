import util from "util";
import client from "shodan-client";
import dotenv from 'dotenv';

dotenv.config();

const searchOpts = {
  minify: true,
};

const apiKey = process.env.apiKey | 'CHAVE_API'

export async function shodanSearch(query) {
  console.log(query)
  if (!query || typeof query !== "string") {
    throw new TypeError("shodanSearch: query must be a non-empty string");
  }

  try {
    const res = await client.search(query, apiKey, searchOpts);
    console.log("Shodan response:", util.inspect(res, { depth: 2 }));
    return res;
  } catch (err) {
    console.error("Erro ao buscar:", err?.message ?? err);
    return null;
  }
}