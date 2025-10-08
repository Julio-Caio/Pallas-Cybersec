const sidebar = document.getElementById("sidebar")
const toggleBtn = document.getElementById("toggle-sidebar")
const integrationList = document.getElementById("integration-list")

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open")
})

let integrations = [
  { id: 1, name: "Shodan", apiKey: "sk_test_1234567890abcdefghijklmnop", createdAt: "2025-01-15" },
]

let visibleKeys = new Set()

function renderIntegrations() {
  integrationList.innerHTML = ""
  integrations.forEach((int) => {
    const isVisible = visibleKeys.has(int.id)

    const card = document.createElement("div")
    card.className = "integration-card"

    // Escolhe ícone de olho conforme estado
    const eyeIcon = isVisible ? "bi bi-eye-slash" : "bi bi-eye"

    card.innerHTML = `
      <h3>${int.name}</h3>
      <div class="key-field">
        <input 
          type="${isVisible ? "text" : "password"}"
          class="key-input"
          value="${isVisible ? int.apiKey : maskKey(int.apiKey)}"
          readonly
        />
        <button class="icon-btn" title="Mostrar/ocultar" onclick="toggleVisibility(${int.id})">
          <i class="${eyeIcon}"></i>
        </button>
        <button class="icon-btn" title="Copiar" onclick="copyKey('${int.apiKey}')"><i class="bi bi-clipboard"></i></button>
        <button class="icon-btn" title="Excluir" onclick="deleteIntegration(${int.id})"><i class="bi bi-trash3"></i></button>
      </div>
      <p class="meta">Criado em ${new Date(int.createdAt).toLocaleDateString("pt-BR")}</p>
    `
    integrationList.appendChild(card)
  })
}

function maskKey(key) {
  return key.slice(0, 6) + "••••••••••••••••" + key.slice(-4)
}

function toggleVisibility(id) {
  if (visibleKeys.has(id)) visibleKeys.delete(id)
  else visibleKeys.add(id)
  renderIntegrations()
}

function copyKey(text) {
  navigator.clipboard.writeText(text)
  alert("Chave copiada!")
}

function deleteIntegration(id) {
  integrations = integrations.filter((i) => i.id !== id)
  renderIntegrations()
}

renderIntegrations()