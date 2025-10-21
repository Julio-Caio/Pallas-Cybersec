import "express-async-errors";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes/routes.js";

const server = express();
const PORT = process.env.PORT || 3000;

server.use(morgan("dev"));

server.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
  })
);

server.use(express.json());

server.use(router);

server.listen(3000, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;