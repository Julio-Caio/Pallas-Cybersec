const baseURL = "localhost:3000/assets" //api
const dateLastUpdate = document.getElementById("last-data-warning");
const btnSelectDomain = document.getElementById("domain-select")

let data = [];

const container = document.getElementById("container-card");

function createCard(component, number, desc) {
  if (!number || typeof number === null || typeof number === undefined) {
    number = "0";
  }
  const cardElement = document.createElement("div");
  cardElement.classList.add("item-card");

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("item-card-body");

  const link = document.createElement("a");
  link.href = "#inventory";
  link.title = "Mais informações";

  const title = document.createElement("h2");
  title.innerText = number;

  const text = document.createTextNode(` ${desc} `);
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-info-circle-fill");

  link.appendChild(title);
  link.appendChild(text);
  link.appendChild(icon);
  cardBodyElement.appendChild(link);
  cardElement.appendChild(cardBodyElement);

  if (component) {
    component.appendChild(cardElement);
  }

  return cardElement;
}

// Formatar data e hora
function formatarDataHoraBR(isoString) {
  const data = new Date(isoString);

  const opcoes = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo"
  };

  return new Intl.DateTimeFormat("pt-BR", opcoes).format(data);
}

// Popula o select de domínios
function populateDomainSelect(item, last_update, domains) {
    item.innerHTML = '<option value="">Selecione</option>';

    domains.forEach(domain => {
        const domainOption = document.createElement("option");
        domainOption.value = domain.name; 
        domainOption.textContent = domain.name;

        item.appendChild(domainOption);

        last_update.innerHTML = `<p class='m-3'><strong>Última varredura</strong>: <span class='text-warning'>${formatarDataHoraBR(domain.update_at)}</span></p>`
    });
}

// Buscar dominios para selecionar
async function fetchDomains() {
    try {
        const res = await fetch("/domains", {
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!res.ok) throw new Error("Erro ao buscar domínios.");

        const domains = await res.json();
        populateDomainSelect(btnSelectDomain, dateLastUpdate, domains);
    } catch (error) {
        showToast("Erro ao carregar domínios.", "danger");
    }
}

fetchDomains();
select_domain();

async function fetch_data(target) {
  try {
    const res  = await fetch(`http://localhost:3000/domains/statistics/${target}`);
    return await res.json();
  } catch (err) {
    console.error("Erro na requisição:", err);
  }
}

function select_domain() {
  btnSelectDomain.addEventListener("change", async (e) => {
    const stats = await fetch_data(e.target.value);
    renderCards(stats);
  });
}

function renderCards(stats) {
  container.innerHTML = "";
  container.appendChild(createCard(container, stats.screenshots.total, "Dispositivos com RDP"));
  container.appendChild(createCard(container, stats.telnet.total, "Dispositivos com Telnet"));
  container.appendChild(createCard(container, stats.databases.total, "Banco de Dados"));
  container.appendChild(createCard(container, stats.smb.total, "Servidores SMB"));
}

select_domain()