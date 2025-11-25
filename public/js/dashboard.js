import { BarChart } from "./components/charts/Bar.js";
import { DoughnutChart } from "./components/charts/Doughnut.js";

let techChart = null;
let serviceChart = null;

const dateLastUpdate = document.getElementById("last-data-warning");
const btnSelectDomain = document.getElementById("domain-select");
const container = document.getElementById("container-card");

const cardAssetsDiv = document.getElementById("card-assets");
const tabDivIPAddress = document.getElementById("ip_addr");
const tabDatabases = document.getElementById("databases");
tabDivIPAddress.appendChild(cardAssetsDiv);

/* -------------------------
   Criação dos Cards
------------------------- */
function createCard(parent, number, desc, iconElement) {
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
    timeZone: "America/Sao_Paulo",
  };

  return new Intl.DateTimeFormat("pt-BR", opcoes).format(data);
}

/* -------------------------
   Popula o select
------------------------- */
function populateDomainSelect(item, last_update, domains) {
  item.innerHTML = '<option value="">Selecione</option>';

  domains.forEach((domain) => {
    const option = document.createElement("option");
    option.value = domain.name;
    option.textContent = domain.name;
    item.appendChild(option);
  });

  const last = domains[domains.length - 1];
  if (last?.update_at) {
    last_update.innerHTML = `<p class="m-3"><strong>Última varredura</strong>: 
       <span class="text-warning">${formatarDataHoraBR(
         last.update_at
       )}</span></p>`;
  }
}

/* -------------------------
   Buscar domínios
------------------------- */
async function fetchDomains() {
  try {
    const res = await fetch("/domains", {
      headers: { "Content-Type": "application/json" },
    });
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
    const res = await fetch(
      `http://localhost:3000/domains/statistics/${target}`
    );
    return await res.json();
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

function normalizeDatabaseAssets(data) {
  if (!data || !data.matches) return [];
  return data.matches;
}

/* -------------------------
   Renderizar Subdomínios
------------------------- */
async function renderSubdomains(list) {
  const container = document.getElementById("subdomains");

  if (!container) {
    console.error("❌ Div #subdomains não encontrada");
    return;
  }

  container.innerHTML = "";

  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = `
      <p class="text-muted">Nenhum subdomínio encontrado.</p>
    `;
    return;
  }

  list.forEach((item) => {
    const host = item.hostnames || "Desconhecido";
    const ip = item.ip || "—";
    const org = item.org || "—";
    const tech = item.services || "—";
    const port = item.ports || "—";

    host.forEach((host) => {
      const card = `
      <div class="card card-subdomain mb-3 shadow-sm">
        <div class="card-header card-subdomain fw-bold">
          ${host}
        </div>
        <div class="card-subdomain card-body">

          <p class="mb-1"><strong>IP:</strong> ${ip}</p>

          <p class="mb-1"><strong>Serviço / Tecnologia:</strong> ${tech}</p>

         <span class="badge text-bg-warning">port: ${port}</span>

          <p class="mb-0"><strong>Organização:</strong> ${org}</p>

        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
    })
  });
}


/* -------------------------
   Renderizar Databases
------------------------- */

async function renderDatabases(list) {
  const container = document.getElementById("databases");
  container.innerHTML = "";

  list.forEach((asset) => {
    const hostnames = asset.hostnames?.length
      ? asset.hostnames
          .map((h) => `<span class="badge text-bg-primary me-1">${h}</span>`)
          .join("")
      : `<span class="text-muted">Sem hostnames</span>`;

    const card = `
      <div class="card mb-3 shadow-sm">
       <div class="card-header text-start fw-bold">
        ${asset.ip_str}
        </div>
        <div class="card-body">

          <h5 class="card-title">${asset.product || "Desconhecido"}</h5>
          
          <p class="card-text mb-1">
            <strong>Porta:</strong> ${asset.port || "-"}
          </p>

          <p class="card-text mb-1">
            <strong>Hostnames:</strong><br>${hostnames}
          </p>

          <p class="card-text mb-1">
            <strong>Organização:</strong> ${asset.org || "-"}
          </p>

          <p class="card-text mb-0">
            <strong>OS:</strong> ${asset.os || "-"}
          </p>

        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
  });
}

async function fetchFacetsDatabases(target) {
  try {
    const res = await fetch(
      `http://localhost:3000/domains/facets/databases/${target}`
    );
    return await res.json();
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

async function loadDatabases(domain) {
  const raw = await fetchFacetsDatabases(domain); // sua função de fetch
  const list = normalizeDatabaseAssets(raw);
  await renderDatabases(list);
}

function initDomainSelection() {
  btnSelectDomain.addEventListener("change", async (e) => {
    if (!e.target.value) return;

    const stats = await fetchStatisticsData(e.target.value);
    renderCards(stats);

    const assets = await getItensbyDomain(e.target.value);

    window.assets = assets;

    const techStats = countByField(assets, "services");
    const portStats = countByField(assets, "ports");

    const techCtx = document.getElementById("top-technologies");
    const serviceCtx = document.getElementById("top-services");

    // destruir gráficos anteriores
    if (techChart) techChart.destroy();
    if (serviceChart) serviceChart.destroy();

    // criar novos
    techChart = DoughnutChart(techCtx, techStats);
    serviceChart = DoughnutChart(serviceCtx, portStats);

    createAsset(assets);
    renderSubdomains(assets)
    await loadDatabases(e.target.value);
  });
}

/* -------------------------
   Renderizar cards
------------------------- */
function renderCards(stats) {
  container.innerHTML = "";

  createCard(
    container,
    stats?.screenshots?.total,
    "RDP HABILITADO",
    "bi-webcam-fill"
  );
  createCard(container, stats?.telnet?.total, "TELNET HABILITADO", "bi-globe");
  createCard(
    container,
    stats?.databases?.total,
    "BANCO DE DADOS",
    "bi-database-exclamation"
  );
  createCard(container, stats?.smb?.total, "SMB EXPOSTO", "bi bi-printer");
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

// renderizar os cards de assets
async function createAsset(list) {
  cardAssetsDiv.innerHTML = "";

  list.forEach((asset) => {
    const hostnames = asset.hostnames
      ? asset.hostnames.map((h) => `<li>${h}</li>`)
      : "";

    // 🔥 Cria ID único baseado no IP
    const offcanvasId = `offcanvas-${(asset.ip || crypto.randomUUID()).replace(
      /[^a-zA-Z0-9]/g,
      ""
    )}`;
    const labelId = `${offcanvasId}-label`;

    const card = `
      <div class="card assets mb-3">
        <div class="card-header text-center fw-bold"><h3>${
          asset.ip || "N/A"
        }</h3></div>

        <div class="card-body">
          <span class="badge text-bg-warning">port: ${asset.ports}</span>
          <span class="badge text-bg-success">product: ${
            asset.services !== null ? asset.services : "N/A"
          }</span>

          <figure>
            <br />

            <!-- O botão aponta para o ID único -->
            <button class="btn btn-primary" type="button" 
              data-bs-toggle="offcanvas"
              data-bs-target="#${offcanvasId}"
              aria-controls="${offcanvasId}">
              Checar detalhes
            </button>

            <!-- Offcanvas com ID único -->
            <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1"
              id="${offcanvasId}" aria-labelledby="${labelId}">

              <div class="offcanvas-header">
                <h3 class="offcanvas-title" id="${labelId}">
                  ${asset.ip}
                </h3>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
              </div>
              <hr>
              <div class="offcanvas-body">
                <div id="org">
                  <p>ORGANIZAÇÃO:</p>
                  <p class="org-name">${asset.org}</p>
                </div>
                <div id="port">
                  <p>PORTA:</p>
                  <p class="port-number">${asset.ports}</p>
                </div>
                                <div id="service">
                  <p>SERVIÇOS:</p>
                  <div id="app">
                    ${
                      asset.services !== null
                        ? `
                            <img class="app-image" src="images/services/${asset.services}.svg" alt="Imagem: ${asset.services}">
                            <p>${asset.services}</p>
                          `
                        : `<p>N/A</p>`
                    }
                  </div>
                </div>
                <div id="os">
                  <p>SISTEMA OPERACIONAL:</p>
                  <div id="os-info">
                    ${
                      asset.os !== null
                        ? `
                            <img class="app-image" src="images/operating_systems/${asset.os}.svg" alt="${asset.os}">
                            <p>${asset.os}</p>
                          `
                        : `<p>N/A</p>`
                    }
                  </div>
                </div>
                <div id="hostnames">
                  <p>HOSTNAMES:</p>
                  <ul>
                    ${hostnames}
                  </ul>
                </div>
              </div>

            </div>
          </figure>
        </div>
      </div>
    `;
    cardAssetsDiv.insertAdjacentHTML("beforeend", card);
  });
}

initDomainSelection();
