import { DoughnutChart } from "./components/charts/Doughnut.js";
import { PieChart } from "./components/charts/Pie.js";
import { renderTabs } from "./components/helpers/tabs.js";

const datasets = [
  {
    id: "content-records",
    label: "Records",
    url: "../../src/db/domains.json",
    key: "records",
    type: "record",
  },
  {
    id: "content-ips",
    label: "IPs",
    url: "../../src/db/ips.json",
    key: "ips",
    type: "address",
  },
];

// DATA JSON
const urlServices = "../../src/db/top-services.json";
const urlTech = "../../src/db/top-technologies.json";

// SETUP
const canvasTech = document.getElementById("top-technologies");
const canvasServices = document.getElementById("top-services");

// Options for Doughnut Charts
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      align: "start",
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

// STYLES
const colors = ["#8800ffff", "#00a06dff", "#1D293D"];

// ============= MAIN ================== //

DoughnutChart(
  canvasTech,
  urlTech,
  {
    label: "Tecnologias Detectadas",
    labelKey: "product",
    subLabelKey: "version",
    valueKey: "count",
    colors,
  },
  options
);

PieChart(
  canvasServices,
  urlServices,
  {
    label: "Serviços Detectados",
    labelKey: "name",
    valueKey: "hosts",
    colors,
  },
  options
);

renderTabs({
  containerTabs: "containerTabs",
  containerContents: "tabContents",
  datasets,
});