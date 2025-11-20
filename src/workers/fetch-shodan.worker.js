import { Worker } from "bullmq";
import IORedis from "ioredis";
import Shodan from "../services/shodan/shodan.js";
import { enqueueProcessing } from "./queue.js";
import dotenv from "dotenv";
import { extractHostsArray } from "../helpers/shodan/normalized.js";

dotenv.config();

const connection = new IORedis({ maxRetriesPerRequest: null });

const fetchShodanWorker = new Worker(
  "fetch-shodan",
  async (job) => {
    const shodan = new Shodan();

    const result = await shodan.search(`hostname:${job.data.domain}`);

    await enqueueProcessing(result);

    return { success: true, result };
  },
  { connection }
);

fetchShodanWorker.on("completed", async (job) => {
  const domain = job.data.domain;
  // 1) remove o “running”
  await connection.del(`scan:running:${domain}`);
  // 2) salva resultado no cache
  await connection.set(
    `scan:cache:${domain}`,
    JSON.stringify(extractHostsArray(job.returnvalue.result)),
    "EX",
    86400 // 24 horas
  );

  console.log(`Job ${job.id} completed and cached`);
});

fetchShodanWorker.on("failed", (job, err) => {
  console.error(`Job with ID: ${job.id} has failed with error: ${err.message}`);
});