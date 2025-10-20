const tableDiv = document.querySelector(".table-container");

async function fetchInternetDB(ip) {
  const resp = await fetch(`http://localhost:3000/api/internetdb/${ip}`, { method: 'GET' });
  if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
  return resp.json();
}

const table = document.createElement("table");
table.classList.add(
  "table",
  "table-dark",
  "table-striped",
  "table-hover",
  "table-bordered"
);
table.style.width = "100%";

const thead = document.createElement("thead");
const tBody = document.createElement("tbody");

function generateTableHead(obj) {
  const tr = document.createElement("tr");
  for (const key of Object.keys(obj)) {
    const th = document.createElement("th");
    th.innerText = key.charAt(0).toUpperCase() + key.slice(1); // capitaliza
    th.classList.add("text-center");
    tr.appendChild(th);
  }
  thead.appendChild(tr);
}

// Corpo
function generateTableBody(array) {
  for (const obj of array) {
    const tr = document.createElement("tr");

    for (const [key, value] of Object.entries(obj)) {
      const td = document.createElement("td");
      td.classList.add("text-center");

      if (Array.isArray(value)) {
        // renderiza arrays como badges
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

    // InternetDB retorna um objeto, transformamos em array para a tabela
    const rows = [data];

    generateTableHead(rows[0]);
    generateTableBody(rows);

    table.appendChild(thead);
    table.appendChild(tBody);
    tableDiv.appendChild(table);
  } catch (err) {
    console.error("Erro ao carregar dados do InternetDB:");
    tableDiv.innerHTML = `<p class="text-danger">Falha ao obter dados, tente novamente</p>`;
  }
});
