const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const overlay = document.getElementById("overlay");
const form = document.getElementById("scanForm");
const input = document.getElementById("scanInput");
const quickButtons = document.querySelectorAll(".action-btn");

toggleBtn.addEventListener("click", () => {
  const isOpen = sidebar.classList.contains("open");
  sidebar.classList.toggle("open", !isOpen);
  sidebar.classList.toggle("closed", isOpen);
  toggleBtn.innerHTML = isOpen ? "☰" : "✖";
});


// Ação do formulário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const target = input.value.trim();
  if (!target) {
    alert("Digite um domínio, IP ou URL para escanear.");
    return;
  }
  console.log("[Scanning:", target);
  alert(`🔍 Iniciando scan em: ${target}`);
});

quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.value;
  });
});
