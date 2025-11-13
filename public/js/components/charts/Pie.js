export async function getDatasetsToCharts(jsonPath, configOptions = { type: "product" }) {
  try {
    const res = await fetch(jsonPath);
    if (!res.ok) throw new Error(`Erro ao buscar ${jsonPath}`);
    const data = await res.json();
    const hosts = Array.isArray(data) ? data : (data.hosts || []);

    // Agrupar por tipo escolhido
    const map = new Map();
    const field = configOptions.type || "product";

    for (const host of hosts) {
      let key;
      switch (field) {
        case "country":
          key = host.location?.country || "Desconhecido";
          break;
        case "port":
          key = host.port ? String(host.port) : "—";
          break;
        default:
          key = host.product || "Desconhecido";
      }
      map.set(key, (map.get(key) || 0) + 1);
    }

    const labels = [...map.keys()];
    const values = [...map.values()];

    const colors = labels.map(() => randomColor());

    return {
      labels,
      datasets: [
        {
          label: `Distribuição por ${field}`,
          data: values,
          backgroundColor: colors,
          borderColor: "#222",
          borderWidth: 1,
        },
      ],
    };
  } catch (err) {
    console.error("Erro ao montar datasets:", err);
    return { labels: [], datasets: [] };
  }
}

function randomColor() {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 16,
          weight: "bold", 
          family: "Arial, sans-serif", 
        },
        color: "#ffffff",
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
  },
};

export async function PieChart(ctx, jsonPath, configOptions) {
  const data = await getDatasetsToCharts(jsonPath, configOptions);

  return new Chart(ctx, {
    type: "pie",
    data,
    options: chartOptions,
  });
}
