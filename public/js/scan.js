const sidebar = document.getElementById("sidebar");
const sidebarNav = document.querySelector('.sidebar-nav')
const toggleBtn = document.getElementById("toggleSidebar");
const form = document.getElementById("scanForm");
const input = document.getElementById("scanInput");
const quickButtons = document.querySelectorAll(".action-btn");


function toggleSidebar()
{
   if (sidebarNav.classList.contains('active')) {
       sidebarNav.classList.remove('active')
   }
    else {
        sidebarNav.classList.add('active');
        
    }
}

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
