import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

// Models
import API from "../models/API.js";
import User from "../models/User.js";
import Module from "../models/Module.js";
import Domain from "../models/Domain.js";
import IPAddress from "../models/IPAddress.js";

// Middleware and Helpers
import { fileURLToPath } from "url";
import { dirname } from "path";
import { hash, userIsValid, isAuthenticated, validateEmail, validatePassword} from "../middleware/auth.js";
import { extractHostsArray } from "../helpers/shodan/services/shodanExtract.js";
import { search } from "../helpers/shodan/Module.js";
import { whoisQuery } from "../helpers/whois/whois.js";


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

router.get("/integrations", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/integrations.html"));
});

router.get("/scan", (req, res) => {
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

router.get("/500-server-error", (req, res) => {
  res.status(500).send("<h1>500 - Internal Server Error</h1><p>Something went wrong on our end.</p>");
});

router.get("/whois/:domain", async (req, res) => {
  try {
    const domain = req.params.domain;
    const data = await whoisQuery(domain);

    // Normaliza alguns campos
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
router.get("/scan/start", async (req, res) => {
  const where = req.query.domain;
  try {
    const result = await search(`hostname:${where}`);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhum resultado retornado pelo Shodan." });
    }

    const resultJSON = extractHostsArray(result);

    return res.status(200).json({
      data: resultJSON,
      redirect: `/dashboard`,
    });
  } catch (err) {
    console.error("Erro na rota /scan/start:", err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});



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

router.post("/api/create", isAuthenticated, async (req, res) => {
  try {
    const { apiKey, id_module, status } = req.body;

    const id_user = req.user.userId;

    console.log("ID do usuário autenticado:", id_user);

    if (!apiKey) {
      return res
        .status(400)
        .json({ error: "O campo 'apiKey' é obrigatório." });
    }

    if (!id_user) {
      return res
        .status(400)
        .json({ error: "O campo 'id_user' é obrigatório." });
    }

    const hashedAPI = await hash(apiKey);
    const newApiKey = await API.create({
      apiKey: hashedAPI,
      id_user,
      id_module,
      status: status ?? true,
    });

    return res.status(201).json({
      message: "Chave de API criada com sucesso!",
      data: newApiKey,
    });
  } catch (err) {
    console.error("Erro ao criar API Key:", err);
    return res.status(500).json({
      error: "Erro interno ao criar chave de API.",
      details: err.message,
    });
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

router.post("/asset/import", async (req, res) => {
  try {
    const assets = req.body;

    if (!Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({
        error: "O corpo da requisição deve ser um array de objetos de ativos.",
      });
    }

    const createdRecords = [];

    for (const asset of assets) {
      const {
        ip,
        domains,
        location,
        ports,
        product,
        hostnames,
        org,
        info,
        isp,
      } = asset;

      // 📌 Salva IP e informações relacionadas
      const ipData = await IPAddress.create({
        ip,
        country: location?.country || null,
        city: location?.city || null,
        os: JSON.stringify(info ? [info] : []),
        ports: JSON.stringify(ports ? [ports] : []),
        services: JSON.stringify(product ? [product] : []),
      });

      // 📌 Salva domínios (evita duplicatas com upsert)
      if (domains && domains.length > 0) {
        await Promise.all(
          domains.map((domainName) =>
            Domain.create({
              where: { name: domainName },
              update: { ip },
              create: {
                name: domainName,
                ip,
              },
            })
          )
        );
      }

      createdRecords.push({ ip: ipData.ip, domains });
    }

    return res.status(201).json({
      message: "Ativos importados e armazenados com sucesso!",
      total: createdRecords.length,
      data: createdRecords,
    });
  } catch (err) {
    console.error("❌ Erro ao importar ativos:", err);
    return res.status(500).json({
      error: "Erro interno ao importar ativos.",
      details: err.message,
    });
  }
});

/**
 * @route GET /asset/ip/:ip
 * @desc Retorna os detalhes de um IP
 */
router.get("/ip/:ip", async (req, res) => {
  try {
    const { ip } = req.params;

    if (!ip) {
      return res.status(400).json({ message: "domain must provided" });
    }

    const ipRecord = await IPAddress.readByIP(ip);

    if (!ipRecord) {
      return res.status(404).json({ error: "IP not found" });
    }

    // Converte campos JSON se existirem
    const parsedOS = ipRecord.os ? JSON.parse(ipRecord.os) : [];
    const parsedPorts = ipRecord.ports ? JSON.parse(ipRecord.ports) : [];
    const parsedServices = ipRecord.services
      ? JSON.parse(ipRecord.services)
      : [];

    return res.json({
      ip: ipRecord.ip,
      country: ipRecord.country,
      city: ipRecord.city,
      ports: parsedPorts,
      services: parsedServices,
      os: parsedOS,
      updatedAt: ipRecord.update_at,
    });
  } catch (error) {
    console.error("Error fetching IP details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @route GET /asset/domain/:domain
 * @desc Retorna os detalhes de um domínio e subdomínios associados
 */
router.get("/domain/:domain", async (req, res) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({ message: "domain must be provided" });
    }

    // Busca domínios que contenham o nome
    const domainResults = await Domain.readByName(domain);

    if (!domainResults || domainResults.length === 0) {
      return res.status(404).json({ error: "Domain not found" });
    }

    // Seleciona o mais recente
    const domainRecord = domainResults[domainResults.length - 1];

    return res.json({
      domain: domainRecord.name,
      nameserver: domainRecord.nameserver,
      ip: domainRecord.ip,
      createdAt: domainRecord.created_at,
      updatedAt: domainRecord.update_at,
    });
  } catch (error) {
    console.error("Error fetching domain details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.use((req, res) => {
  res.status(404).redirect("/404-not-found");
});

router.use((req, res) => {
  res.status(404).redirect("/401-unauthorized");
})

router.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.code || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
  });
});

export default router;
