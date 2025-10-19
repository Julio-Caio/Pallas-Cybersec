const tableDiv = document.querySelector(".table-container");

const fields = [
  {
    IP: "200.129.77.237",
    Tag: null,
    Link: "google.com",
    Country: "BR",
    Ports: [80, 443],
    CVE: ["CVE1", "CVE2"],
    SSL: "Expired",
  },
  {
    IP: "200.129.77.238",
    Tag: null,
    Link: "facebook.com",
    Country: "BR",
    Ports: [80, 553],
    CVE: ["CVE1", "CVE2"],
    SSL: "Valid",
  },
];

// Criar tabela e aplicar classes Bootstrap
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

// Cabeçalho
function generateTableHead(obj) {
  const tr = document.createElement("tr");
  for (const key of Object.keys(obj)) {
    const th = document.createElement("th");
    th.innerText = key;
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

      if (key === "Link" && value) {
        const a = document.createElement("a")
        const svg = document.createElement("i");
        svg.setAttribute('class', "bi bi-box-arrow-up-right text-primary")
        a.href = `https://${value}`;
        a.target = "_blank";
        a.appendChild(svg)
        td.appendChild(a);
      } else if (key === "SSL") {
        td.innerText = value ?? "-";
        if (value === "Expired")
          td.classList.add("bg-danger", "text-white", "fw-bold");
        if (value === "Valid")
          td.classList.add("bg-success", "text-white", "fw-bold");
      } else if (key === "Ports" && Array.isArray(value)) {
        td.innerHTML = value
          .map((port) => {
            let color = "secondary";
            if (port === 80) color = "success";
            else if (port === 443) color = "primary";
            else color = "warning";
            return `<span class="badge bg-${color} me-1">${port}</span>`;
          })
          .join("");
      } else if (key === "CVE" && Array.isArray(value)) {
        td.innerHTML = value
          .map((cve) => `<span class="badge bg-info me-1">${cve}</span>`)
          .join("");
      } else {
        td.innerText = value ?? "-";
      }

      tr.appendChild(td);
    }

    tBody.appendChild(tr);
  }
}

window.addEventListener("load", () => {
  generateTableHead(fields[0]);
  generateTableBody(fields);

  table.appendChild(thead);
  table.appendChild(tBody);
  tableDiv.appendChild(table);
});
