// config/redis.js
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: 0,
});

redis.on("connect", () => console.log("✅ Redis conectado!"));
redis.on("error", (err) => console.error("Erro no Redis:", err));

export default redis
