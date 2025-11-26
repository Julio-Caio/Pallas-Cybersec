// =========================
// VARIÁVEIS GLOBAIS
// =========================
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-sidebar");
const moduleList = document.getElementById("module-list");
const baseUrl = "http://localhost/api/modules";
const visibleModules = new Set();

// =========================
// Sidebar
// =========================
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

// =========================
// Funções utilitárias
// =========================
async function fetchMod(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      console.warn("Erro HTTP:", response.status, url);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      console.warn("Resposta não é JSON:", url);
      return null;
    }

    return await response.json();

  } catch (err) {
    console.error("Erro ao buscar módulo:", err);
    return null;
  }
}

// =========================
// API
// =========================
function getModules() {
  return fetchMod(baseUrl);
}

function deleteModule(id) {
  return fetchMod(`${baseUrl}/${id}`, { method: "DELETE" });
}

function addModule(data) {
  return fetchMod(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// =========================
// Renderização
// =========================
function renderModules(data) {
  if (!Array.isArray(data)) {
    console.warn("Dados inválidos recebidos em renderModules:", data);
    moduleList.innerHTML = "<p class='text-muted'>Nenhum módulo encontrado.</p>";
    return;
  }

  moduleList.innerHTML = "";

  data.forEach((mod) => {
    const isVisible = visibleModules.has(mod.id);
    const card = document.createElement("div");
    card.className = "module-card";
    card.dataset.id = mod.id;

    card.innerHTML = `
      <h3>${mod.name}</h3>
      <hr>
        <p><strong>Descrição: </strong> <span class='fw-bold text-warning'>${mod.desc}</span>
        <br>
        <hr>
        <button class="icon-btn btn-delete" title="Excluir">
          <i class="bi bi-trash3"></i>
        </button>
    `;

    moduleList.appendChild(card);
  });
}

// =========================
// Delegação de eventos
// =========================
moduleList.addEventListener("click", async (e) => {
  const card = e.target.closest(".module-card");
  if (!card) return;

  const id = card.dataset.id;

  if (e.target.closest(".btn-toggle")) {
    if (visibleModules.has(id)) visibleModules.delete(id);
    else visibleModules.add(id);

    const data = await getModules();
    return renderModules(data);
  }

  if (e.target.closest(".btn-copy")) {
    const input = card.querySelector(".module-input");
    input.select();
    navigator.clipboard.writeText(input.value);
    return;
  }

  if (e.target.closest(".btn-delete")) {
    document.getElementById("confirmDelete").setAttribute("data-id", id);

    const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
    return modal.show();
  }
});

// =========================
// Adicionar Módulo
// =========================
const addButton = document.getElementById("addButton");
addButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const moduleInput = document.getElementById("name");
  const descInput = document.getElementById("desc");

  const newModule = {
    name: moduleInput.value,
    desc: descInput.value,
  };

  const response = await addModule(newModule);
  if (!response) {
    alert("Erro ao adicionar módulo.");
    return;
  }

  alert("Módulo adicionado com sucesso!");

  const data = await getModules();
  renderModules(data);

  const modalEl = document.getElementById("Modal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  moduleInput.value = "";
  descInput.value = "";
});

// =========================
// Confirmação de exclusão
// =========================
const confirmDeleteBtn = document.getElementById("confirmDelete");

confirmDeleteBtn.addEventListener("click", async () => {
  const id = confirmDeleteBtn.getAttribute("data-id");

  await deleteModule(id);

  const data = await getModules();
  renderModules(data);

  const modalEl = document.getElementById("deleteModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

// =========================
// Inicialização
// =========================
(async function init() {
  const data = await getModules();
  renderModules(data);
})();