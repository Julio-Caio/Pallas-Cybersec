import { BarChart } from "./components/charts/Bar.js";
import { DoughnutChart } from "./components/charts/Doughnut.js";

let techChart = null;
let serviceChart = null;


const dateLastUpdate = document.getElementById("last-data-warning");
const btnSelectDomain = document.getElementById("domain-select");
const container = document.getElementById("container-card");

/* -------------------------
   Criação dos Cards
------------------------- */
function createCard(parent, number, desc) {
  const value = number ?? "0";

  const cardElement = document.createElement("div");
  cardElement.classList.add("item-card");

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("item-card-body");

  const link = document.createElement("a");
  link.href = "#inventory";
  link.title = "Mais informações";

  const title = document.createElement("h2");
  title.innerText = value;

  const text = document.createTextNode(` ${desc} `);
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-info-circle-fill");

  link.appendChild(title);
  link.appendChild(text);
  link.appendChild(icon);
  cardBodyElement.appendChild(link);
  cardElement.appendChild(cardBodyElement);

  parent.appendChild(cardElement);
}

/* -------------------------
   Formatar data
------------------------- */
function formatarDataHoraBR(isoString) {
  const data = new Date(isoString);

  const opcoes = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo"
  };

  return new Intl.DateTimeFormat("pt-BR", opcoes).format(data);
}

/* -------------------------
   Popula o select
------------------------- */
function populateDomainSelect(item, last_update, domains) {
  item.innerHTML = '<option value="">Selecione</option>';

  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain.name;
    option.textContent = domain.name;
    item.appendChild(option);
  });

  const last = domains[domains.length - 1];
  if (last?.update_at) {
    last_update.innerHTML =
      `<p class="m-3"><strong>Última varredura</strong>: 
       <span class="text-warning">${formatarDataHoraBR(last.update_at)}</span></p>`;
  }
}

/* -------------------------
   Buscar domínios
------------------------- */
async function fetchDomains() {
  try {
    const res = await fetch("/domains", { headers: { "Content-Type": "application/json" }});
    if (!res.ok) throw new Error("Erro ao buscar domínios.");

    const domains = await res.json();

    if (!Array.isArray(domains)) {
      console.warn("Resposta inválida de /domains");
      return;
    }

    populateDomainSelect(btnSelectDomain, dateLastUpdate, domains);
  } catch (error) {
    console.log("Erro ao carregar domínios", error);
  }
}

function countByField(items, field) {
  const map = {};

  for (const item of items) {
    const value = item[field];

    if (value && value !== "—") {
      map[value] = (map[value] || 0) + 1;
    }
  }

  return map;
}

fetchDomains();

/* -------------------------
   Dados estatísticos
------------------------- */
async function fetchStatisticsData(target) {
  try {
    const res = await fetch(`http://localhost:3000/domains/statistics/${target}`);
    return await res.json();
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

function initDomainSelection() {
  btnSelectDomain.addEventListener("change", async (e) => {
  if (!e.target.value) return;

  const stats = await fetchStatisticsData(e.target.value);
  renderCards(stats);

  const assets = await getItensbyDomain(e.target.value);

  const techStats = countByField(assets, "services");
  const portStats = countByField(assets, "ports");

  const techCtx = document.getElementById("top-technologies");
  const serviceCtx = document.getElementById("top-services");

  // destruir gráficos anteriores
  if (techChart) techChart.destroy();
  if (serviceChart) serviceChart.destroy();

  // criar novos
  techChart = BarChart(techCtx, techStats);
  serviceChart = DoughnutChart(serviceCtx, portStats);
});
}

/* -------------------------
   Renderizar cards
------------------------- */
function renderCards(stats) {
  container.innerHTML = "";

  createCard(container, stats?.screenshots?.total, "Dispositivos com RDP");
  createCard(container, stats?.telnet?.total, "Dispositivos com Telnet");
  createCard(container, stats?.databases?.total, "Banco de Dados");
  createCard(container, stats?.smb?.total, "Servidores SMB");
}

/* -------------------------
   Buscar itens por domínio
------------------------- */
async function getItensbyDomain(domain) {
  try {
    const res = await fetch(`http://localhost:3000/scan/results/${domain}`);
    return res.json();
  } catch (error) {
    console.log(`Erro ao importar os dados: ${error}`);
  }
}

initDomainSelection();