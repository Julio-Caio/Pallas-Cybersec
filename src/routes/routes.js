import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import redis from "../config/redis.js";

// Models
import API from "../models/API.js";
import User from "../models/User.js";
import Module from "../models/Module.js";
import IPAddress from "../models/IPAddress.js";

// Middleware and Helpers
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  hash,
  userIsValid,
  isAuthenticated,
  validateEmail,
  validatePassword,
} from "../middleware/auth.js";

import { whoisQuery } from "../helpers/whois/whois.js";

import Shodan from "../services/shodan/shodan.js";
import Domain from "../models/Domain.js";

dotenv.config();

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

router.use(cookieParser());

// Public Static Pages
router.get("/", express.static(path.join(__dirname, "../../public")));

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/signup.html"));
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/dashboard.html"));
});

router.get("/integrations", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/integrations.html"));
});

router.get("/scan", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/scan.html"));
});

router.get("/403-forbidden", (req, res) => {
  res.status(403).sendFile(path.join(__dirname, "../../public/403.html"));
});

router.get("/401-unauthorized", (req, res) => {
  res.status(401).sendFile(path.join(__dirname, "../../public/401.html"));
});

router.get("/404-not-found", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../../public/404.html"));
});

router.get("/500-internal-server-error", (req, res) => {
  res
    .status(500)
    .send(
      "<h1>500 - Internal Server Error</h1><p>Something went wrong on our end.</p>"
    );
});

router.get("/whois/:domain", isAuthenticated, async (req, res) => {
  try {
    const domain = req.params.domain;
    const data = await whoisQuery(domain);

    res.json({
      domain: domain,
      owner: data.orgName || data.owner || "N/A",
      ownerid: data.ownerid || "N/A",
      responsible: data.responsible || "N/A",
      country: data.country || "N/A",
      nserver: Array.isArray(data.nameServers)
        ? data.nameServers.join(", ")
        : data.nameServer || "N/A",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar WHOIS" });
  }
});

router.post("/scan/start", isAuthenticated, async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ message: "Um domínio válido é requerido" });
    }

    const module = await Module.readByName("Shodan");
    if (!module) {
      return res.status(500).json({ message: "Adicione um módulo!" });
    }

    const key = await API.readByModule(req.userId, module.id);
    if (!key) {
      return res.status(400).json({ message: "API Key inválida. Verifique sua chave" });
    }
    // verificar se existe entrada
    const cacheID = `shodan:${domain}`; 
    const cached = await redis.get(cacheID); 
    if (cached) { return res.status(200).json(JSON.parse(cached)); }
    // Busca Shodan
    const shodan = new Shodan(key.apiKey);
    const results = await shodan.search(`hostname:${domain}`);

    // Garantir domínio único
    let domainDB = await Domain.readByName(domain);

    if (!domainDB) {
      domainDB = await Domain.create(domain); // deve retornar objeto, não só id
      console.log(`Domínio criado: ${domainDB.id}`);
    } else {
      console.log(`Domínio já existe: ${domainDB.id}`);
    }

    // Processar IPs
    for (const doc of results.matches) {
      const payload = {
        ip: doc.ip_str,
        domainName: domainDB.id,
        domains: doc.domains || [],
        hostnames: doc.hostnames || [],
        asn: doc.asn || null,
        country: doc.location.country_code || null,
        city: doc.location.city || null,
        org: doc.org || null,
        os: doc.os || null,
        ports: String(doc.port || ""),
        services: doc.product || null,
      };

      const existing = await IPAddress.readByIP(doc.ip_str);

      if (!existing) {
        await IPAddress.create(payload);
      } else {
        await IPAddress.update({ id: existing.id, ...payload });
      }
    }

    // salvar em cache
    await redis.set(cacheID, JSON.stringify(results), "EX", 1800);

    return res.status(200).json({message: 'Aguarde alguns segundos'})

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao executar coleta" });
  }
});

router.get("/scan/results/:domain", async (req, res) => {
  try {
    const { domain } = req.params
    const results = await IPAddress.readByDomain(domain)
    res.status(200).json(results);

  } catch (error) {
    console.error(`Erro interno: ${error}`)
    return res.status(500)
  }
});

router.get("/domains", isAuthenticated, async (req, res) => {
  try {
    const myDomains = await Domain.readAll();
    if (myDomains.length === 0 || !myDomains) {
      return res.status(200).json({ message: 'Não há domínios cadastrados!'})
    }
    return res.status(200).json(myDomains)
  } catch (error) {
    console.error(`Erro interno: ${error}`)
    return res.status(500)
  }
});

router.get("/domains/info/:domain", isAuthenticated, async (req, res) => {
  try {
    const { domain } = req.params;
    const assets = await Domain.readByName(domain)

    if (!assets || assets.length === 0) {
      return res.status(404).json({
        error: "Nenhum registro encontrado para esse domínio."
      });
    }

    res.status(200).json(assets);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

router.get("/domains/statistics/:domain", async (req, res) => {
  try {
    const domain = req.params.domain
    console.log(domain)
    const module = await Module.readByName("Shodan");
    const key = await API.readByModule(req.userId, module.id);

    if (!module) {
      return res.status(500).json({ message: "Adicione um módulo!" });
    }

    if (!domain) {
      return res.status(400).json({ message: "Um domínio válido é requerido" });
    }

    if (!key) {
      return res.status(400).json({ message: "API Key inválida. Verifique sua chave" });
    }

    const shodan = new Shodan(key.apiKey);
    const databases = await shodan.count(`product:mysql,redis,mongodb,mariadb,postgresql,influxdb,ms-sql hostname:${domain}`);
    const screenshots = await shodan.count(`product:"Remote Desktop Protocol" hostname:${domain}`);
    const smb_exposures = await shodan.count(`product:samba "Authentication disabled" hostname:${domain}`);
    const telnet_devices = await shodan.count(`port:23 "telnet" hostname:${domain}`);

    return res.status(200).json({databases: databases, screenshots: screenshots, smb: smb_exposures, telnet:telnet_devices})

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao executar coleta"
    });
  }
})

router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const emailExists = await User.readByEmail(email);

    if (emailExists) {
      return res.status(409).json({ error: "Email is already registered!" });
    }
    // Encrypt the password
    const hashedPassword = await hash(password);

    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    // Check for duplication error (for Prisma)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email is already registered!" });
    }
    console.error("Error during user creation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const validUser = await userIsValid(email, password);

    if (!validUser.exists) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const token = jwt.sign(
      { userId: validUser.user.id, email: validUser.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ message: "Login bem-sucedido, redirecionando..." });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/module/create", async (req, res) => {
  try {
    const { name, desc } = req.body;

    if (!name) {
      throw new HttpError("Parâmetros incompletos", 400);
    }

    const newModule = await Module.create({
      name,
      desc,
    });

    return res.status(201).json({
      message: "Módulo criado com sucesso!",
      data: newModule,
    });
  } catch (err) {
    console.error("Erro ao criar Módulo:", err);
    return res.status(500).json({
      error: "Erro interno ao criar Módulo.",
      details: err.message,
    });
  }
});


router.get("/integrations/keys", isAuthenticated, async (req, res) => {
  try {
    const id_user = req.user.userId;
    const integrations = await API.readAllByUser(id_user);

    const enriched = await Promise.all(
      integrations.map(async (int) => {
        const module = await Module.read(int.id_module);
        return {
          id: int.id,
          apiKey: int.apiKey,
          module: module.name,
        };
      })
    );

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("Erro ao buscar integrações:", err);
    return res.status(500).json({
      error: "Erro interno ao buscar integrações.",
      details: err.message,
    });
  }
});

router.post("/integrations/keys", isAuthenticated, async (req, res) => {
  try {
    const { apiKey, module } = req.body;
    const apiKeyTrim = apiKey.trim() // remove white spaces
    const id_user = req.user.userId;

    if (!apiKey || !module) {
      return res
        .status(400)
        .json({ error: "Os campos 'apiKey' e 'id_module' são obrigatórios." });
    }

    const moduleExists = await Module.readByName(module);

    if (!moduleExists) {
      return res.status(404).json({ error: "Módulo não encontrado." });
    }
    const id_module = moduleExists.id;

    const newIntegration = await API.create({
      apiKey: apiKeyTrim,
      id_user,
      id_module,
      status: true,
    });

    return res.status(201).json({
      message: "Integração criada com sucesso!",
      data: newIntegration,
    });
  } catch (err) {
    console.error("Erro ao criar integração:", err);
    return res.status(500).json({
      error: "Erro interno ao criar integração.",
      details: err.message,
    });
  }
});

// Delete Integration
router.delete("/integrations/keys/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user.userId;

    const integration = await API.read(id);

    if (!integration) {
      return res.status(404).json({ error: "Integração não encontrada." });
    }

    if (integration.id_user !== id_user) {
      return res.status(403).json({
        error: "Você não tem permissão para deletar esta integração.",
      });
    }

    await API.remove(id);

    return res
      .status(200)
      .json({ message: "Integração deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar integração:", err);
    return res.status(500).json({
      error: "Erro interno ao deletar integração.",
      details: err.message,
    });
  }
});

router.use((req, res) => {
  res.status(404).redirect("/404-not-found");
});

router.use((req, res) => {
  res.status(404).redirect("/401-unauthorized");
});

router.use((req, res) => {
  res.status(500).redirect("/500-internal-server-error");
});

router.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.code || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
});

export default router;