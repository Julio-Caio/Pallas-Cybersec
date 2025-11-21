import { DoughnutChart } from "./components/charts/Doughnut.js";
import { PieChart } from "./components/charts/Pie.js";

const titleAssetSidebar = document.querySelector("#title-asset");
export const containerPort = document.querySelector("#container-port");
export const containerTech = document.querySelector("#tech-body");


function createCard(component, number, desc) {
  if (!number || typeof number === null || typeof number === undefined) {
    number = "-/-";
  }
  const cardElement = document.createElement("div");
  cardElement.classList.add("item-card");

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("item-card-body");

  const link = document.createElement("a");
  link.href = "#inventory";
  link.title = "Mais informações";

  const title = document.createElement("h2");
  title.innerText = number;

  const text = document.createTextNode(` ${desc} `);
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-info-circle-fill");

  link.appendChild(title);
  link.appendChild(text);
  link.appendChild(icon);
  cardBodyElement.appendChild(link);
  cardElement.appendChild(cardBodyElement);

  if (component) {
    component.appendChild(cardElement);
  }

  return cardElement;
}

const container = document.getElementById("container-card");

function createWhoisCard(data) {
  return `
      <div class="container-more who-is-summary">
        <div class="who-is-summary title">
          <h4>Who Is</h4>
        </div>
        <div class="who-is-summary body">
          <p><strong>Domain:</strong> ${data.domain}</p>
          <p><strong>Owner:</strong> ${data.owner}</p>
          <p><strong>Owner ID:</strong> ${data.ownerid}</p>
          <p><strong>Responsible:</strong> ${data.responsible}</p>
          <p><strong>Country:</strong> ${data.country}</p>
          <p><strong>Nameservers:</strong> ${data.nserver}</p>
        </div>
      </div>
    `;
}

async function getHostnames(assets) {
  const hostnames = new Set();

  for (const item of assets) {
    if (item.hostnames && item.hostnames.length > 0) {
      item.hostnames.forEach((hostname) => hostnames.add(hostname));
    }
  }
  console.log("Hostnames únicos encontrados:", hostnames);
  return Array.from(hostnames);
}

async function loadWhois(domain) {
  try {
    const response = await fetch(`http://localhost:3000/whois/${domain}`);
    const data = await response.json();
    createWhoisCard(data);
  } catch (err) {
    console.error("Erro ao buscar WHOIS:", err);
  }
}

const response = await fetch("http://localhost:3000/scan/start?domain=");
const json = await response.json();
export const assets = Array.isArray(json.data) ? json.data : [];
const hostnames = await getHostnames(assets);

container.appendChild(createCard(container, 0, "Banco de Dados"));
container.appendChild(createCard(container, hostnames.length, "Hostnames"));
container.appendChild(createCard(container, json.data.length, "Endereços IPs"));
container.appendChild(createCard(container, 1, "Capturas de Tela"));

async function getPorts(data) {
  const ports = new Set();
  for (const item of data) {
    if (item.port) ports.add(item.port);
  }
  return Array.from(ports); // converte o Set em array
}

function createPortCard(ports) {
  // cria o container principal
  const container = document.createElement("div");
  container.classList.add("container-more", "ports");

  // título
  const titleDiv = document.createElement("div");
  titleDiv.classList.add("ports", "title");
  titleDiv.innerHTML = `<h4 id="ports-title">Ports</h4>`;
  container.appendChild(titleDiv);

  // corpo
  const bodyDiv = document.createElement("div");
  bodyDiv.classList.add("ports", "body");

  // adiciona cada porta como div
  ports.forEach((port) => {
    const portDiv = document.createElement("div");
    portDiv.classList.add("port");
    portDiv.textContent = port;
    bodyDiv.appendChild(portDiv);
  });

  container.appendChild(bodyDiv);

  // retorna o bloco completo (container + linha)
  return container;
}
// 1️⃣ Obtém o container onde quer inserir
// 2️⃣ Busca as portas e cria o card dinamicamente
(async () => {
  const ports = await getPorts(assets);
  const portCard = createPortCard(ports);

  // 3️⃣ Adiciona no container
  containerPort.appendChild(portCard);
})();

async function getTech(assets) {
  const techs = new Set();

  for (const item of assets) {
    if (item.product && item.product !== "—") {
      techs.add(item.product);
    }
  }

  return Array.from(techs); // <-- transforma em array
}

const techs = await getTech(assets);

function createTechCard(techList) {
  const container = document.createElement("div");
  container.classList.add("container-more", "tech");

  const title = document.createElement("div");
  title.classList.add("tech", "title", "text-light");
  title.innerHTML = `<h4 id="tech-title">Technologies</h4>`;

  const body = document.createElement("div");
  body.classList.add("tech", "body");
  body.id = "tech-body";

  techList.forEach((t) => {
    const div = document.createElement("div");
    div.classList.add("technologies");
    div.textContent = t;
    body.appendChild(div);
  });

  container.appendChild(title);
  container.appendChild(body);
  return container;
}

const techCard = createTechCard(techs);
containerTech.appendChild(techCard);

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

// 1. Conta tecnologias
const techStats = countByField(assets, "product");
const PortStats = countByField(assets, "port");

// 3. Renderiza
const techCtx = document.getElementById("top-technologies");
PieChart(techCtx, techStats);

const serviceCtx = document.getElementById("top-services");
DoughnutChart(serviceCtx, PortStats);

function createAccordionItem(data) {
  const collapseId = `collapse-${data.ip.replace(/\./g, "-")}`;

  return `
    <div class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#${collapseId}" 
          aria-expanded="false" 
          aria-controls="${collapseId}">
          ${data.ip}
        </button>
      </h2>

      <div id="${collapseId}" 
        class="accordion-collapse collapse" 
        data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <strong>IP:</strong> ${data.ip}<br>
          <strong>Hostname:</strong> ${data.hostnames?.join(", ") || "—"}<br>

          <button 
  type="button" 
  class="btn btn-primary mt-3 btn-details"
  data-ip="${data.ip}">
  Detalhes
</button>

        </div>
      </div>
    </div>
  `;
}

const html = assets.map((item) => createAccordionItem(item)).join("");
document.getElementById("tabContents").innerHTML = html;

function openSidebarWithItem(asset) {
  titleAssetSidebar.innerHTML = `Ativo: <span class="text-danger text-bold"><ins>${asset.ip}</ins></span>`;

  containerPort.innerHTML = "";
  containerTech.innerHTML = "";

  // WHOIS
  if (asset.domains?.length) {
    loadWhois(asset.domains[0]);
  }

  // PORTAS
  const ports = [asset.port];
  const portCard = createPortCard(ports);
  containerPort.appendChild(portCard);

  // TECNOLOGIAS
  const techs = asset.product && asset.product !== "—" ? [asset.product] : [];
  const techCard = createTechCard(techs);
  containerTech.appendChild(techCard);

  // AQUI você dispara o evento que abre a sidebar
  document.querySelector("#more-info").classList.add("active");
}

// evento para abrir a sidebar respectiva de cada item
document.addEventListener("click", (event) => {
  const btn = event.target.closest(".btn-details");
  if (!btn) return;

  const ip = btn.dataset.ip;

  const asset = assets.find((a) => a.ip === ip);

  if (!asset) {
    console.error("Asset não encontrado:", ip);
    return;
  }

  openSidebarWithItem(asset);
});