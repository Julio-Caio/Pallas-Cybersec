const tableDiv = document.querySelector(".table-container");
const spinner = document.querySelector(".spinner-container");

function toggleSpinner(state) {
  // state = true → ativa / mostra
  // state = false → desativa / esconde
  if (state) {
    spinner.classList.add("active");
    tableDiv.style.display = "none"; // esconde a tabela
  } else {
    spinner.classList.remove("active");
    tableDiv.style.display = "block"; // mostra a tabela
  }
}

async function fetchInternetDB(ip) {
  toggleSpinner(true); // ativar spinner

  try {
    const resp = await fetch(`http://localhost:3000/api/internetdb/${ip}`);
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
    toggleSpinner(false);
    return await resp.json();
  } catch (err) {
    throw err;
  }
}

const table = document.createElement("table");
table.classList.add(
  "table",
  "table-dark",
  "table-striped",
  "table-hover",
  "table-bordered",
  "align-middle",
  "text-center"
);
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
    for (const [key, value] of Object.entries(obj)) {
      const td = document.createElement("td");
      if (Array.isArray(value)) {
        td.innerHTML = value
          .map((v) => `<span class="badge bg-primary me-1">${v}</span>`)
          .join("");
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
    tableDiv.innerHTML = `<p class="text-danger text-center mt-3">Falha ao obter dados. Tente novamente.</p>`;
  }
});
