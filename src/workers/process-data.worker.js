import { Worker } from "bullmq";
import IORedis from "ioredis";
import { enqueueSave } from "./queue.js";
import { extractHostsArray, extractHostsMap } from "../helpers/shodan/normalized.js";
const connection = new IORedis({ maxRetriesPerRequest: null });

const processDataWorker = new Worker(
  "process-data",
  async (job) => {
    const raw = job.data.data;

    // Processamento real usando suas funções
    const hostsArray = extractHostsArray(raw);
    const hostsMap = extractHostsMap(raw);
    console.log("Hosts map keys:", Array.from(hostsMap.keys())); // exemplo de log

    // Logs úteis
    console.log("=== PROCESS-DATA WORKER ===");
    console.log("Job:", job.id);
    console.log("Total de hosts:", hostsArray.length);
    console.log("IPs:", hostsArray.map(h => h.ip));
    console.log("Map size:", hostsMap.size);

    const processed = {
      totalHosts: hostsArray.length,
      hostsArray,
      hostsMapSize: hostsMap.size,
    };

    // Enviar para fila "save-results"
    await enqueueSave(processed);

    return processed; // fica salvo no BullMQ
  },
  { connection }
);

// eventos
processDataWorker.on("completed", (job) => {
  console.log(`process-data: job ${job.id} concluído.`);
});

processDataWorker.on("failed", (job, err) => {
  console.error(`process-data: job ${job.id} falhou: ${err.message}`);
});
