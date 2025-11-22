// Variáveis Globais

const cardAssets = document.getElementById("card-assets");
const checkboxes = document.querySelectorAll(
  "#filter-options .form-check-input"
);

const buttonFilter = document.getElementById("filter");
const filterOptionsDiv = document.getElementById("filter-options");

buttonFilter.addEventListener("click", () => {
  filterOptionsDiv.classList.toggle("active");
});

checkboxes.forEach((cb) => {
  cb.addEventListener("change", () => {
    // manter apenas uma marcada
    if (cb.checked) {
      checkboxes.forEach((o) => o !== cb && (o.checked = false));
    }

    const selected = getValueCheckbox();
    console.log(selected);

    switch (selected) {
      case "database":
        filterByProduct(databases, assets);
        break;

      case "web_server":
        filterByProduct(web_servers, assets);
        break;

      case "rdp_devices":
        filterByProduct(remote_devices, assets);
        break;

      default:
        createAsset(assets);
        break;
    }
  });
});

const res = await fetch(`http://localhost:3000/scan/results/${domain}`);
const data = await res.json();
// renderizar os cards de assets
async function createAsset(domain) {
    domain.forEach((asset) => {
      const hostnames = asset.hostnames
        ? asset.hostnames
            .map((h) => `<span class="badge text-bg-primary">${h}</span>`)
            .join("")
        : "";

      const card = `
      <div class="card subdomains mb-3">
        <div class="card-header text-center fw-bold">${
          asset.name || "N/A"
        }</div>

        <div class="card-body">
          <span class="badge text-bg-success">product: ${asset.services}</span>
          <span class="badge text-bg-warning">${asset.ip || "Sem IP"}</span>

          ${hostnames}

          <figure>
            <br />
            <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">
              Checar detalhes
            </button>

            <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions"
              aria-labelledby="offcanvasWithBothOptionsLabel">
              <div class="offcanvas-header">
                <h5 class="offcanvas-title">
                  Detalhes do ativo
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
              </div>
              <div class="offcanvas-body">
                <p>Dados adicionais podem ser renderizados aqui.</p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    `;

      cardAssets.insertAdjacentHTML("beforeend", card);
});}
// filtrar com base numa classe de serviços
// selecionar checkbox e capturar value

// Permitir apenas uma checkbox selecionada (filtros)

//filtros de database
const databases = [
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "influxdb",
  "ms-sql",
];
const remote_devices = [
  "OpenSSH",
  "VNC",
  "RealVNC Enterprise",
  "RealVNC Enterprise",
  "Remote Desktop Protocol",
];

//filtros dos principais web servers
const web_servers = [
  "nginx",
  "Microsoft IIS httpd",
  "Apache Tomcat/Coyote JSP engine",
  "Apache Tomcat",
  "Apache httpd",
];

//filtros por porta rdp

//filtros por telnet

// filtros por samba

function getValueCheckbox() {
  const selected = [...checkboxes].find((cb) => cb.checked);
  return selected ? selected.value : null;
}

// filtro genérico que recebe como parâmetro o array de itens que o incluem
function filterByProduct(arr, data) {
  if (!arr) {
    createAsset(data);
    return;
  }

  const filtered = data.filter((a) =>
    arr.some((item) => a.services.toLowerCase().includes(item.toLowerCase()))
  );

  createAsset(filtered);
}