// sidebar
const closeBtn = document.getElementById("closebtn");
closeBtn.addEventListener("click", () => {
  toggleSidebar();
});

function openAsset(evt, assetName) {
  let i;

  // Esconde todas as tabcontent
  const tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Remove classe active de todos os botões
  const tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Mostra o conteúdo da aba clicada
  document.getElementById(assetName).style.display = "block";

  // Marca o botão clicado como ativo
  evt.currentTarget.classList.add("active");
}


// tabs
document.querySelectorAll(".tablinks").forEach(btn => {
  btn.addEventListener("click", evt => {
    openAsset(evt, btn.dataset.target);
  });
});