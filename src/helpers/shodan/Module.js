import dotenv from "dotenv";
dotenv.config();

import client from "shodan-client";

const API_KEY = process.env.SHODAN_API_KEY;

const searchOpts = { minify: true };

export async function search(query) {
  try {
    const res = await client.search(query, API_KEY, searchOpts);
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export async function count(query) {
  try {
    const res = await client.count(query, API_KEY, searchOpts);
    return res
  } catch (err) {
    console.error(err);
    return err;
  }
}