import { getDatasetsToTabs } from "./getData.js"; // ou fetch-based no browser

/**
 * Cria abas e acordeões dinamicamente a partir de múltiplos datasets
 * @param {Object} config - Configuração
 * @param {string} config.containerTabs - ID do container das tabs
 * @param {string} config.containerContents - ID do container dos conteúdos
 * @param {Array} config.datasets - Array de objetos { id, label, items?, url?, key?, type }
 */
export async function renderTabs(config) {
  const { containerTabs, containerContents, datasets } = config;
  const tabsEl = document.getElementById(containerTabs);
  const contentsEl = document.getElementById(containerContents);

  if (!tabsEl || !contentsEl) return;

  tabsEl.innerHTML = "";
  contentsEl.innerHTML = "";

  for (let idx = 0; idx < datasets.length; idx++) {
    const dataset = datasets[idx];

    // Carrega os dados: ou pega items diretamente ou via getDatasetsToTabs
    let items = dataset.items || [];
    if (dataset.url) {
      items = await getDatasetsToTabs(dataset.url, dataset.key);
    }

    const isActive = idx === 0 ? "active" : "";
    const isShown = idx === 0 ? "show active" : "";

    // Cria botão da aba
    const btn = document.createElement("li");
    btn.classList.add("nav-item");
    btn.innerHTML = `
      <button class="nav-link ${isActive}" id="tab-${dataset.id}"
        data-bs-toggle="tab" data-bs-target="#${dataset.id}" type="button" role="tab">
        ${dataset.label}
      </button>`;
    tabsEl.appendChild(btn);

    // Cria conteúdo da aba
    const pane = document.createElement("div");
    pane.className = `tab-pane fade ${isShown}`;
    pane.id = dataset.id;
    pane.setAttribute("role", "tabpanel");
    pane.innerHTML = `<div class="accordion" id="accordion-${dataset.id}"></div>`;
    contentsEl.appendChild(pane);

    // Cria acordeões
    createAccordion(`accordion-${dataset.id}`, items, dataset.type);
  }
}

/**
 * Cria acordeões genéricos (reutilizável)
 */
export function createAccordion(containerId, items, type) {
  const accordion = document.getElementById(containerId);
  if (!accordion) return;
  accordion.innerHTML = "";

  items.forEach((item, index) => {
    const itemId = `${containerId}-collapse${index}`;
    let title = item.name || item.addr || item || "Item";
    let body = "";

    switch (type) {
      case "record":
        title = `${item.name}`;
        body = `<p><strong>Type:</strong> ${item.type}</p><p><strong>Address:</strong> ${item.value}</p>`;
        break;

      case "address":
        title = `${item.addr}`;
        body = `<p><strong>ISP:</strong> ${item.isp}</p>
          <p><strong>Country:</strong> ${item.country}</p>
          <p><strong>Ports:</strong> ${item.port.join(", ")}</p>`;
        break;

      case "isp":
        body = `<p>${item}</p>`;
        break;
    }

    accordion.innerHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${containerId}-heading${index}">
          <button class="accordion-button collapsed bg-dark text-light fw-semibold"
            type="button" data-bs-toggle="collapse"
            data-bs-target="#${itemId}" aria-expanded="false"
            aria-controls="${itemId}">
            ${title}
          </button>
        </h2>
        <div id="${itemId}" class="accordion-collapse collapse"
          aria-labelledby="${containerId}-heading${index}"
          data-bs-parent="#${containerId}">
          <div class="accordion-body bg-dark-subtle text-dark rounded-bottom">${body}</div>
        </div>
      </div>`;
  });
}
