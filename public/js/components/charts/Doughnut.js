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
export function DoughnutChart(ctx, statsObject, options = chartOptions) {
  const labels = Object.keys(statsObject);
  const values = Object.values(statsObject);

  const data = {
    labels,
    datasets: [
      {
        label: "Count",
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
    type: "doughnut",
    data,
    options,
  });
}
