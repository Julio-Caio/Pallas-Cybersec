// =========================
// VARIÁVEIS GLOBAIS
// =========================
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");
const integrationList = document.getElementById("integration-list");
const baseUrl = "http://localhost:3000/integrations/keys";
const visibleKeys = new Set();

// =========================
// Sidebar
// =========================
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// =========================
// Funções utilitárias
// =========================
async function fetchInt(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Erro ao buscar integração:", err);
  }
}

// =========================
// API
// =========================
function getIntegrations() {
  return fetchInt(baseUrl);
}

function deleteIntegration(id) {
  return fetchInt(`${baseUrl}/${id}`, { method: "DELETE" });
}

function addIntegration(data) {
  return fetchInt(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// =========================
// Renderização
// =========================
function maskKey(key) {
  return key.slice(0, 6) + "••••••••••••••••" + key.slice(-4);
}

function renderIntegrations(data = []) {
  integrationList.innerHTML = "";

  data.forEach((int) => {
    const isVisible = visibleKeys.has(int.id);
    const card = document.createElement("div");
    card.className = "integration-card";
    card.dataset.id = int.id;

    card.innerHTML = `
      <h3>${int.module}</h3>

      <div class="key-field">
        <input 
          type="${isVisible ? "text" : "password"}"
          class="key-input"
          value="${isVisible ? int.apiKey : maskKey(int.apiKey)}"
          readonly
        />

        <button class="icon-btn btn-toggle" title="Mostrar/ocultar">
          <i class="${isVisible ? "bi bi-eye-slash" : "bi bi-eye"}"></i>
        </button>

        <button class="icon-btn btn-copy" title="Copiar">
          <i class="bi bi-clipboard"></i>
        </button>

        <button class="icon-btn btn-delete" title="Excluir">
          <i class="bi bi-trash3" id="delete-${int.id}"></i>
        </button>
      </div>

      <p class="meta">
        Criado em ${new Date(int.createdAt).toLocaleDateString("pt-BR")}
      </p>
    `;

    integrationList.appendChild(card);
  });
}

// =========================
// Delegação de eventos
// =========================
integrationList.addEventListener("click", async (e) => {
  const card = e.target.closest(".integration-card");
  if (!card) return;

  const id = card.dataset.id;

  // Mostrar/ocultar
  if (e.target.closest(".btn-toggle")) {
    if (visibleKeys.has(id)) visibleKeys.delete(id);
    else visibleKeys.add(id);

    const data = await getIntegrations();
    return renderIntegrations(data);
  }

  // Copiar
  if (e.target.closest(".btn-copy")) {
    const item = (await getIntegrations()).find((i) => i.id === id);
    if (!item) return;
    navigator.clipboard.writeText(item.apiKey);
    alert("Chave copiada!");
    return;
  }

  // Deletar - ABRIR MODAL
  if (e.target.closest(".btn-delete")) {
    document.getElementById("confirmDelete").setAttribute("data-id", id);

    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    return modal.show();
  }
});

// =========================
// Adicionar integração
// =========================
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", async () => {
  const moduleInput = document.getElementById("module");
  const apiKeyInput = document.getElementById("key");

  const newIntegration = {
    module: moduleInput.value,
    apiKey: apiKeyInput.value,
  };

  const response = await addIntegration(newIntegration);
  if (!response) {
    alert("Erro ao adicionar integração.");
    return;
  } else {
    alert("Integração adicionada com sucesso!");
  }

  const data = await getIntegrations();
  renderIntegrations(data);

  // Fechar modal e limpar campos
  const modalEl = document.getElementById("Modal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  moduleInput.value = "";
  apiKeyInput.value = "";
});

// =========================
// Confirmar exclusão
// =========================

const confirmDeleteBtn = document.getElementById("confirmDelete");

confirmDeleteBtn.addEventListener("click", async () => {
  const id = confirmDeleteBtn.getAttribute("data-id");
  await deleteIntegration(id);
  const data = await getIntegrations();
  renderIntegrations(data);

  const modalEl = document.getElementById("deleteModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

// =========================
// Inicialização
// =========================
(async function init() {
  const data = await getIntegrations();
  renderIntegrations(data);
})();
