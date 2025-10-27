import { getDatasetsToCharts } from "../helpers/getData.js";

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
