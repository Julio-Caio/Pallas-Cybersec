import { Worker } from "bullmq";
import IPAddress from "../models/IPAddress";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

const saveResults =  new Worker(
  "save-results",
  async (job) => {
    console.log("Saving to DB:", job.data.results);
    return { saved: true };
  },
  { connection }
);

saveResults.on("completed", (job) => {
  console.log(`Job with ID: ${job.id} has been completed`);
});

saveResults.on("failed", (job, err) => {
  console.error(`Job with ID: ${job.id} has failed with error: ${err.message}`);
});