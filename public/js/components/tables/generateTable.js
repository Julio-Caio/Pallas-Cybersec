// Modelo de função para importar dados, onde chamar a API e gerar a tabela dinamicamente
// e inserir no DOM em um local específico.
const tab = document.querySelectorAll('.tabcontent');


async function fetchDadosAPI(baseURL, org, module, param) {
  // Função para buscar dados de uma API com base em um parâmetro
  // Retorna os dados em formato JSON
    const response = await fetch(`http://${baseURL}/api/${org}/${module}/${param}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }
    return await response.json();
}

// Função que aceita parâmetros com número de colunas, quais os dados, estilo da tabela, etc.

const table = document.createElement("table");
table.classList.add("table", "table-dark", "table-striped", "table-hover", "table-bordered", "align-middle", "text-center");
table.style.width = "100%";

const thead = document.createElement("thead");
const tBody = document.createElement("tbody");

function generateTableHead(obj) {
  const tr = document.createElement("tr");
  for (const key of Object.keys(obj)) {
    const th = document.createElement("th");
    th.innerText = key.charAt(0).toUpperCase() + key.slice(1);
    tr.appendChild(th);
  }
  thead.appendChild(tr);
}

function generateTableBody(array) {
  for (const obj of array) {
    const tr = document.createElement("tr");
    for (const [, value] of Object.entries(obj)) {
      const td = document.createElement("td");
      if (Array.isArray(value)) {
        td.innerHTML = value.map(v => `<span class="badge bg-primary me-1">${v}</span>`).join("");
      } else {
        td.innerText = value ?? "-";
      }
      tr.appendChild(td);
    }
    tBody.appendChild(tr);
  }
}

window.addEventListener("load", async () => {
  try {
    const data = await fetchInternetDB("8.8.8.8");
    const rows = [data];

    generateTableHead(rows[0]);
    generateTableBody(rows);

    table.appendChild(thead);
    table.appendChild(tBody);
    tableDiv.appendChild(table);
  } catch (err) {
    console.error("Erro ao carregar dados do InternetDB:", err);
    tableDiv.innerText = `<p class="text-danger text-center mt-3">Falha ao obter dados. Tente novamente.</p>`;
  }
});