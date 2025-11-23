const chartOptions = {
  responsive: true,

  plugins: {
    legend: {
      position: "left",
      labels: {
        font: {
          size: 18,
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
export function PolarChart(ctx, statsObject, options = chartOptions) {
  const labels = Object.keys(statsObject);
  const values = Object.values(statsObject);

  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: values,
        hoverOffset: 4,
      },
    ],
  };

  return new Chart(ctx, {
    type: "polarArea",
    data,
    options,
  });
}