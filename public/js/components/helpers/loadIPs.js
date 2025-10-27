import fs from "fs/promises";
import path from "path";

const baseURL = path.resolve("../src/db/ips.json");

export async function loadIPsPerISP() {
  try {
    const data = await fs.readFile(baseURL, "utf-8");
    const { ips } = JSON.parse(data);

    const ispCounts = ips.reduce((acc, item) => {
      acc[item.isp] = (acc[item.isp] || 0) + 1;
      return acc;
    }, {});

    console.log(ispCounts);
  } catch (err) {
    console.error("Erro ao carregar IPs:", err);
  }
}
