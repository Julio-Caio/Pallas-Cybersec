import express, { json } from "express";
import { validationResult } from "express-validator";
import { shodanSearch } from "../helpers/shodan/services/search.js";
import {
  getMicrosoftServers,
  getMicrosoftDesktops,
} from "../helpers/shodan/services/os/getOS.js";
import { getRouters } from "../helpers/shodan/services/network_devices/getDevices.js";
import {
  getScreenshots,
  getDatabases,
  getExposureSMB,
  getFTPServers,
} from "../helpers/shodan/services/apps/getApps.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { extractHostsMap } from "../helpers/shodan/services/shodanExtract.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

async function handleShodanRoute(req, res, queryBuilder) {
  try {
    const key = Object.keys(req.query)[0];
    const value = req.query[key];
    if (!value) throw new HttpError("Parâmetro ausente.", 400);

    const query = queryBuilder(value);
    const result = await shodanSearch(query);

    if (!result || (result.total || 0) === 0)
      throw new HttpError("Nenhum resultado encontrado.", 404);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Erro em rota Shodan:", err);

    if (err instanceof HttpError) {
      return res.status(err.code).json({ message: err.message });
    }

    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

// Public Static Pages
router.get("/", express.static(path.join(__dirname, "../../public")));

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/dashboard.html"));
});

router.get("/integrations", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/integrations.html"));
});

router.get("/scan", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/scan.html"));
});

// Rota básica
router.get("/scan/host", (req, res) =>
  handleShodanRoute(req, (v) => `hostname:${v}`)
);

router.get("/scan/screenshot", (req, res) =>
  handleShodanRoute(req, getScreenshots)
);

router.get("/scan/routers", (req, res) =>
  handleShodanRoute(req, getRouters)
);

router.get("/scan/smb", (req, res) =>
  handleShodanRoute(req, getExposureSMB)
);

router.get("/scan/ftp", (req, res) =>
  handleShodanRoute(req, getFTPServers)
);

router.get("/scan/database", async (req, res) => {
  try {
    const { hostname, product = "mysql,postgresql,mariadb" } = req.query;
    if (!hostname) {
      return res.status(400).json({ message: "Parâmetro 'hostname' obrigatório." });
    }
    const query = getDatabases(product, hostname);
    const result = await shodanSearch(query);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.post('/target/ip', async (req, res) => {
  const { name } = req.body;
  
})

router.post('/target/domain', async (req, res) => {
  const { name } = req.body;
  
})

export default router;