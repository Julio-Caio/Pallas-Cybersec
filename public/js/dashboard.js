import { renderTabsAndAccordions } from "./components/accordion/renderTabs.js";

function openSummary(evt, tabName) {
  // Oculta todos os conteúdos de abas
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove a classe 'active' de todos os botões
  const tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Exibe o conteúdo da aba clicada
  document.getElementById(tabName).style.display = "block";

  // Marca o botão da aba atual como ativo
  evt.currentTarget.classList.add("active");
}

async function init() {
  const res = await fetch('../../src/db/db.json'); // caminho do seu arquivo JSON
  const jsonData = await res.json();

  renderTabsAndAccordions(jsonData, 'resultsContainer');
}

init();