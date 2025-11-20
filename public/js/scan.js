const form = document.getElementById("scanForm");
const input = document.getElementById("scanInput");
const feedback = document.getElementById("feedback");
const quickButtons = document.querySelectorAll(".action-btn");

/**
 * Extrai e valida hostname.
 * Regras: devolve hostname em lowercase sem 'www.', requer pelo menos um '.' e TLD com >=2 letras.
 * Retorna null se inválido.
 */
function escapeURL(raw) {
  if (!raw || typeof raw !== "string") return null;
  const str = raw.trim();

  // captura o hostname (aceita esquemas malformados como http:/)
  const re =
    /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:\/*)?(?:[^@\/\n]+@)?([^:\/?\n]+)(?::\d+)?(?:[\/?].*)?$/;
  const m = str.match(re);
  if (!m) return null;

  let host = m[1].toLowerCase();

  // valida caracteres básicos
  if (!/^[a-z0-9.-]+$/.test(host)) return null;
  if (host.startsWith(".") || host.endsWith(".")) return null;

  // exige pelo menos um ponto e TLD com apenas letras e pelo menos 2 caracteres
  const parts = host.split(".");
  if (parts.length < 2) return null;
  const tld = parts[parts.length - 1];
  if (!/^[a-z]{2,63}$/.test(tld)) return null;

  // labels não podem começar/terminar com hífen e cada label <=63 chars
  for (const lbl of parts) {
    if (lbl.length === 0 || lbl.length > 63) return null;
    if (/^-|-$/.test(lbl)) return null;
  }

  return host;
}

function showFeedback(message, { type = "error" } = {}) {
  // limpa mensagens antigas
  feedback.innerHTML = "";

  const p = document.createElement("p");
  p.setAttribute("role", type === "error" ? "alert" : "status");

  // Define o conteúdo com o ícone e o texto
  p.innerHTML = `
  <i class="bi ${
    type === "error" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"
  }"></i>
  ${message}
`;

  // Estilos visuais
  p.style.background = type === "error" ? "crimson" : "seagreen";
  p.style.color = "white";
  p.style.padding = ".4em .6em";
  p.style.borderRadius = "6px";
  p.style.border = "1px solid rgba(255,255,255,0.6)";
  p.style.display = "inline-flex"; // melhor alinhamento ícone + texto
  p.style.alignItems = "center";
  p.style.gap = "0.4em";
  p.style.marginTop = ".5em";
  p.style.fontWeight = "500";

  feedback.appendChild(p);

  // Fade out após 2s (opcional)
  setTimeout(() => {
    p.style.opacity = "0";
    p.style.transition = "opacity .3s ease";
    setTimeout(() => p.remove(), 300);
  }, 2000);
}

function doSubmit(e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  feedback.innerHTML = "";
  input.classList.remove("is-invalid");

  const raw = input.value;

  const normalized = escapeURL(raw);
  if (normalized === null) {
    showFeedback("Campo inválido!", { type: "error" });
    input.classList.add("is-invalid");
    input.focus();

    setTimeout(() => {
      feedback.innerHTML = "";
      input.classList.remove("is-invalid");
    }, 2000);

    return null;
  }

  input.value = "";
  return normalized;
}

input.addEventListener("input", () => {
  feedback.innerHTML = "";
  input.classList.remove("is-invalid");
});

form.addEventListener("submit", async (e) => {
  const value = doSubmit(e);
  if (!value) return;

  // Feedback imediato
  feedback.innerHTML = `
    <div class="loading-msg">
      <div class="spinner-border text-light" role="status"></div>
      <p>Iniciando o escaneamento para <strong>${value}</strong>...</p>
    </div>
  `;

  try {
    const res = await fetch(`/scan/start?domain=${value}`);
    const json = await res.json();

    // -------------------------------
    // 1) Resultado vindo do cache
    // -------------------------------
    if (res.status === 200 && json.source === "cache") {
      feedback.innerHTML = `
        <div class="loading-msg">
          <i class="bi bi-check-circle-fill"></i>
          <p>Resultado disponível em /dashboard!</p>
        </div>
      `;
      console.log("CACHE:", json.results);
      return;
    }

    // -------------------------------
    // 2) Scan já está em execução
    // -------------------------------
    if (res.status === 202 && json.message.includes("já está")) {
      feedback.innerHTML = `
        <div class="loading-msg">
          <div class="spinner-grow text-light" role="status"></div>
          <p>Scan já em andamento... acompanhando progresso.</p>
        </div>
      `;
      checkProgress(json.jobId);
      return;
    }

    // -------------------------------
    // 3) Novo scan iniciado
    // -------------------------------
    if (res.status === 202) {
      feedback.innerHTML = `
        <div class="loading-msg">
          <div class="spinner-border text-light" role="status"></div>
          <p>Novo scan iniciado! Acompanhando progresso...</p>
        </div>
      `;
      checkProgress(json.jobId);
      return;
    }

  } catch (err) {
    console.error(err);
    showFeedback("Falha ao conectar ao servidor.", { type: "error" });
  }
});

/**
 * Consulta o backend a cada 2s para saber como está o job
 */
async function checkProgress(jobId) {
  const interval = setInterval(async () => {
    try {
      const res = await fetch(`/scan/status/${jobId}`);
      if (!res.ok) throw new Error("Erro ao consultar status");
      const data = await res.json();

      feedback.innerHTML = `
        <div class="loading-msg">
          <p>Status: <strong>${data.status}</strong></p>
          <p>Progresso: <strong>${data.progress || 0}%</strong></p>
          <div class="spinner-border text-light"></div>
        </div>
      `;

      // Finalizado
      if (data.status === "completed") {
        clearInterval(interval);
        feedback.innerHTML = `
          <div class="loading-msg">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        `;

        return;
      }

      // Falhou
      if (data.status === "failed") {
        clearInterval(interval);
        showFeedback("O scan falhou.", { type: "error" });
        return;
      }

    } catch (err) {
      console.error(err);
      clearInterval(interval);
      showFeedback("Erro consultando progresso.", { type: "error" });
    }
  }, 2000);
}