const mapDiv = document.querySelector("#mapa");

async function initializeMap(domain) {
  let coords;

  try {
    // Tenta buscar coordenadas do domínio
    const resp = await fetch(`http://localhost:3000/api/whois/geo/${domain}`);
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);
    const data = await resp.json();
    coords = { latitude: data.latitude, longitude: data.longitude };
  } catch (err) {
    console.warn("Erro ao buscar coordenadas do domínio:", err);
  }

  // Se não obteve coords, tenta pegar IP público do usuário
  if (!coords) {
    try {
      const resp = await fetch(`http://localhost:3000/api/my-ip`);
      const ipData = await resp.json();

      // Aqui você precisaria chamar sua função getCoordinates com o IP
      // Por simplicidade, podemos usar coordenadas fixas como fallback
      coords = { latitude: -7.23056, longitude: -35.88111 };
      console.log("Usando fallback:", coords);
    } catch (err) {
      console.error("Erro ao obter IP público ou coordenadas fallback:", err);
      coords = { latitude: -7.23056, longitude: -35.88111 };
    }
  }

  // Inicializa o mapa
  const map = L.map(mapDiv, {
    center: [coords.latitude, coords.longitude],
    zoom: 13,
    zoomControl: false,
  });

  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([coords.latitude, coords.longitude])
    .addTo(map)
    .bindPopup(`Localização de ${domain}`)
    .openPopup();
}

document.addEventListener("DOMContentLoaded", () => {
  initializeMap("example.com");
});
