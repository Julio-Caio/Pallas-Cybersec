const features = [
  {
    title: "Automação de processos",
    description:
      "Realize o processo de reconhecimento e coleta de dados passiva dos seus ativos em um click",
    icon: "images/infrastructure.jpg",
  },
  {
    title: "Coleta de dados e análise",
    description:
      "Obtenha insights detalhados sobre sua infraestrutura com análises em tempo real e relatórios completos.",
    icon: "images/pie-chart.jpg",
  },
  {
    title: "Prevenção de riscos",
    description:
      "Saber o que deve estar ou não exposto é o primeiro passo para mitigar ataques.",
    icon: "images/security.jpg",
  },
];

const grid = document.getElementById("features-grid");
grid.innerHTML = ""; // limpa conteúdo anterior

features.forEach((f) => {
  const card = document.createElement("div");
  card.className = "feature-card";

  const img = document.createElement("img");
  img.src = f.icon;
  img.alt = f.title;
  img.loading = "lazy";
  img.decoding = "async";

  const title = document.createElement("h3");
  title.textContent = f.title;

  const desc = document.createElement("p");
  desc.textContent = f.description;

  card.appendChild(img);
  card.appendChild(title);
  card.appendChild(desc);

  grid.appendChild(card);
});
