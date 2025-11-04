const form = document.getElementById("scanForm");
const input = document.getElementById("scanInput");
const quickButtons = document.querySelectorAll(".action-btn");


function validateIP(ip) {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const target = input.value.trim();

  if(!validateIP(target)) {
    alert("⚠️ Endereço IP inválido!");
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
