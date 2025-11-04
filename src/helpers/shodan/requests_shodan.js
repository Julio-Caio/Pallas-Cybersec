import dotenv from "dotenv/config";

import util from "util";
import client from "shodan-client";

const searchOpts = {
  filters: "ip_str, hostnames",
  minify: true,
};

const apiKey = process.env.SHODAN_API_KEY;

export const shodanHostnameResults = client
  .search("hostname:example.com", apiKey, searchOpts)
  .then((res) => {
    console.log("Result:");
    console.log(util.inspect(res, { depth: 4 }));
    return res;
  })
  .catch((err) => {
    console.error("Error:", err);
    return null;
  });
