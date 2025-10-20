import express from "express";
import { getInternetDB } from "../controllers/shodan_modules/internetdb.js";

const router = express.Router();

class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

/* InternetDB endpoint */
router.get("/api/internetdb/:ip", async (req, res, next) => {
  const ip = req.params.ip;

  try {
    const data = await getInternetDB(ip);
    return res.status(200).json(data);
  } catch (err) {
    return next(
      new HttpError(`Failed to fetch InternetDB data for IP ${ip}: ${err.message}`, 500)
    );
  }
});

// 404 handler
router.use((req, res) => {
  return res.status(404).json({ message: "Content not found!" });
});

// Error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something broke!" });
});

export default router;