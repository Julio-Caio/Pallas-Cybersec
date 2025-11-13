import express from "express";
import path from "path";
import API from "../models/API.js";
import User from "../models/User.js";
import Module from "../models/Module.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { hash } from "../middleware/auth.js";
import { extractHostsArray } from "../helpers/shodan/services/shodanExtract.js";
import { search } from "../helpers/shodan/Module.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
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

router.get("/api/whois", async (req, res) => {
  const { domain } = req.query;
  if (!domain) return res.status(400).json({ error: "Domain obrigatório." });

  const result = await whoisSearch(domain);
  res.json(result);
});

router.get("/scan/start", async (req, res) => {
  const where = req.query.domain;
  // adicionar validação ao where
  try {
    const result = await search(`hostname:${where}`);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhum resultado retornado pelo Shodan." });
    }

    const resultJSON = extractHostsArray(result);

    return res.status(200).json(resultJSON);
  } catch (err) {
    console.error("Erro na rota /scan/start:", err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.get("/scan/result/smb/:domain", async (req, res) => {
  const where = req.params;
  try {
    const result = await search(
      `product:samba "Authentication disabled" hostname:${where}`
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhum resultado retornado pelo Shodan." });
    }

    const resultJSON = extractHostsArray(result);

    return res.status(200).json(resultJSON);
  } catch (err) {
    console.error("Erro na rota /scan/start:", err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.get("/scan/result/screenshots/:domain", async (req, res) => {
  const where = req.params;
  try {
    const result = await search(`has_screenshot:true hostname:${where}`);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhum resultado retornado pelo Shodan." });
    }

    const resultJSON = extractHostsArray(result);

    return res.status(200).json(resultJSON);
  } catch (err) {
    console.error("Erro na rota /scan/screenshots:", err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.get("/scan/result/databases/:domain", async (req, res) => {
  const where = req.query.domain;
  try {
    const result = await search(
      `product:"mysql,mariadb,postgresql,mongodb,redis" hostname:${where}`
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "Nenhum resultado retornado pelo Shodan." });
    }

    const resultJSON = extractHostsArray(result);

    return res.status(200).json(resultJSON);
  } catch (err) {
    console.error("Erro na rota /scan/screenshots:", err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

router.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await User.readByEmail(email);

    if (emailExists) {
      return res.status(409).json({ error: "Email is already registered!" });
    }
    // Encrypt the password
    const hashedPassword = await hash(password);

    // Create the user in the database
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

router.post("/api/create", async (req, res) => {
  try {
    const { apiKey, id_user, id_module, status } = req.body;

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

export default router;