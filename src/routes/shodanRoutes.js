// routes/shodanRoute.js
import express from "express";
import { shodanHos}
import { extractHostsMap } from "../services/shodanExtract.js";
import {
  readSubdomains,
  readPorts,
  readProducts,
  readWebServers,
  readOperatingSystems,
  readIPs,
} from "../utils/hostReaders.js";

const router = express.Router();

/**
 * GET /api/shodan/hostname/:hostname
 * Ex: /api/shodan/hostname/example.com
 */
router.get("/hostname/:hostname", async (req, res) => {
  try {
    const { hostname } = req.params;
    if (!hostname) return res.status(400).json({ error: "hostname required" });

    const obj = await shodanHostnameResults(hostname);
    if (!obj || !Array.isArray(obj.matches)) {
      return res.status(502).json({ error: "Resultado inválido do Shodan", raw: obj });
    }

    const hostsMap = extractHostsMap(obj);

    // gera um resumo simples
    const summary = {
      totalHosts: hostsMap.size,
      subdomains: Array.from(readSubdomains(hostsMap)),
      ports: Array.from(readPorts(hostsMap)),
      products: Array.from(readProducts(hostsMap)),
      webServers: Array.from(readWebServers(hostsMap)),
      operatingSystems: Array.from(readOperatingSystems(hostsMap)),
      ips: Array.from(readIPs(hostsMap)),
    };

    return res.json({ summary, hosts: Array.from(hostsMap.values()) });
  } catch (err) {
    console.error("route error:", err);
    return res.status(500).json({ error: "internal_server_error", message: err?.message });
  }
});

export default router;