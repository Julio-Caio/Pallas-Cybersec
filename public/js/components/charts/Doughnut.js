import { getDatasetsToCharts } from "../helpers/getData.js";

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 16, // aumenta o tamanho da fonte da legenda
          weight: "bold", // opcional, deixa mais forte
          family: "Arial, sans-serif", // opcional, define a fonte
        },
        color: "#ffffff", // cor da legenda
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

export async function DoughnutChart(ctx, jsonPath, configOptions) {
  const data = await getDatasetsToCharts(jsonPath, configOptions);

  return new Chart(ctx, {
    type: "doughnut",
    data,
    options: chartOptions,
  });
}
