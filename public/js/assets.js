const domains = {
  domain: "ifpb.edu.br",
  records: [
    { name: "ifpb.edu.br", type: "A", value: "200.129.77.237" },
    { name: "ifpb.edu.br", type: "MX", value: "alt1.aspmx.l.google.com" },
    { name: "academico.ifpb.edu.br", type: "A", value: "200.129.77.8" },
    {
      name: "ava.ifpb.edu.br",
      type: "CNAME",
      value: "alb-ead-74462806.sa-east-1.elb.amazonaws.com",
    },
    { name: "ava2017.ead.ifpb.edu.br", type: "A", value: "200.129.74.13" },
    { name: "cti.cabedelo.ifpb.edu.br", type: "A", value: "200.129.79.85" },
    { name: "devel.ifpb.edu.br", type: "A", value: "200.129.77.26" },
    {
      name: "labmicro.cabedelo.ifpb.edu.br",
      type: "A",
      value: "200.129.79.85",
    },
    {
      name: "suap.ifpb.edu.br",
      type: "CNAME",
      value: "alb-dgti-1687892527.sa-east-1.elb.amazonaws.com",
    },
    { name: "www.ifpb.edu.br", type: "CNAME", value: "v077237.ifpb.edu.br" },
  ],
};

const ips = [
  "200.129.79.85",
  "200.129.74.16",
  "200.129.77.3",
  "200.129.74.12",
  "159.203.79.141",
  "200.129.77.16",
  "200.129.79.57",
];

const isp = [
  "Rede Nacional de Ensino e Pesquisa",
  "DigitalOcean, LLC",
  "TELY Ltda.",
  "Amazon.com, Inc.",
];

// Containers
const tabContents = document.getElementById("tabContents");
const domainTabs = document.getElementById("domainTabs");

// Função para criar accordion cards
function createAccordion(containerId, items, type) {
  const accordion = document.getElementById(containerId);
  items.forEach((item, index) => {
    const itemId = `${containerId}-collapse${index}`;
    const card = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${containerId}-heading${index}">
          <button class="accordion-button collapsed bg-dark text-light fw-semibold" type="button"
            data-bs-toggle="collapse" data-bs-target="#${itemId}" aria-expanded="false"
            aria-controls="${itemId}">
            ${
              type === "record"
                ? `${item.name} | <span class="record-type">${item.type}</span>`
                : item
            }
          </button>
        </h2>
        <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="${containerId}-heading${index}"
          data-bs-parent="#${containerId}">
          <div class="accordion-body bg-dark-subtle text-dark rounded-bottom">
            ${
              type === "record"
                ? `<p><strong>Type:</strong> ${item.type}</p><p><strong>Address:</strong> ${item.value}</p>`
                : `<p>${type.toUpperCase()}: ${item}</p>`
            }
          </div>
        </div>
      </div>`;
    accordion.innerHTML += card;
  });
}

// Cria abas dinamicamente
const tabs = [
  {
    id: "content-records",
    label: "Records",
    items: domains.records,
    type: "record",
  },
  { id: "content-ips", label: "IPs", items: ips, type: "ip" },
  { id: "content-isp", label: "ISPs", items: isp, type: "isp" },
];

tabs.forEach((tab, idx) => {
  // Cria botão da aba
  const activeClass = idx === 0 ? "active" : "";
  const tabButton = document.createElement("li");
  tabButton.classList.add("nav-item");
  tabButton.setAttribute("role", "presentation");
  tabButton.innerHTML = `
    <button class="nav-link ${activeClass}" id="tab-${tab.id}" data-bs-toggle="tab" data-bs-target="#${tab.id}" type="button" role="tab">
      ${tab.label}
    </button>`;
  domainTabs.appendChild(tabButton);

  // Cria conteúdo da aba
  const showClass = idx === 0 ? "show active" : "";
  const tabPane = document.createElement("div");
  tabPane.className = `tab-pane fade ${showClass}`;
  tabPane.id = tab.id;
  tabPane.setAttribute("role", "tabpanel");
  tabPane.innerHTML = `<div class="accordion" id="accordion-${tab.id}"></div>`;
  tabContents.appendChild(tabPane);

  // Cria acordeões dentro da aba
  createAccordion(`accordion-${tab.id}`, tab.items, tab.type);
});
