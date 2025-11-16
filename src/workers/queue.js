import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const fetchShodanQueue = new Queue("fetch-shodan", { connection });
export const processDataQueue = new Queue("process-data", { connection });
export const saveResultsQueue = new Queue("save-results", { connection });

export async function addJobToQueue(domain) {
  const job = await fetchShodanQueue.add("scan-domain", { domain });
  console.log(`Job ${job.id} added to fetch-shodan`);
  return job;
}

export async function enqueueProcessing(data) {
  const job = await processDataQueue.add("process", { data });
  console.log(`Job ${job.id} added to process-data`);
  return job;
}

export async function enqueueSave(results) {
  const job = await saveResultsQueue.add("save", { results });
  console.log(`Job ${job.id} added to save-results`);
  return job;
}