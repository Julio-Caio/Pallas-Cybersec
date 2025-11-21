const chartOptions = {
  responsive: true,

  plugins: {
    tooltip: {
      enabled: true,
    },
  },

  scales: {
    x: {
      ticks: {
        color: "#ffffff", // texto branco no eixo X
      },
      grid: {
        color: "rgba(255,255,255,0.2)",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#ffffff", // texto branco no eixo Y
      },
      grid: {
        color: "rgba(255,255,255,0.2)",
      },
    },
  },

  animation: {
    animateRotate: true,
    animateScale: true,
  },
};

export function BarChart(ctx, statsObject, options = chartOptions) {
  const labels = Object.keys(statsObject);
  const values = Object.values(statsObject);

  const data = {
    labels,
    datasets: [
      {
        label: "Quantidade",
        data: values,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return new Chart(ctx, {
    type: 'bar',
  data,
  options: options
  });
}
