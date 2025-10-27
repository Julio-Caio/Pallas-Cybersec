/**
 * Função genérica para gerar dados de gráfico Chart.js a partir de um arquivo JSON.
 *
 * @param {string} baseURL - Caminho do arquivo JSON (ex: './data/technologies.json')
 * @param {Object} config - Opções de mapeamento e estilo
 * @returns {Promise<Object>} Objeto de dados compatível com Chart.js
 */

export async function getDatasetsToCharts(baseURL, config = {}) {
  const {
    label = "Dataset",
    labelKey = "label",
    subLabelKey = null,
    valueKey = "value",
    colors = ["#116358ff", "#830044ff"],
    style = {},
  } = config;

  // Faz o fetch do JSON
  const response = await fetch(baseURL);
  if (!response.ok)
    throw new Error(`Erro ao carregar ${baseURL}: ${response.statusText}`);

  const dataset = await response.json();

  // Cria labels dinamicamente
  const labels = dataset.map((item) => {
    if (subLabelKey && item[subLabelKey]) {
      return `${item[labelKey]} ${item[subLabelKey]}`;
    }
    return item[labelKey];
  });

  // Cria datasets compatíveis com Chart.js
  const defaultStyle = {
    label,
    data: dataset.map((item) => item[valueKey]),
    backgroundColor: colors.slice(0, dataset.length),
    borderWidth: 2,
    borderColor: "#fff",
    hoverOffset: 10,
  };

  return {
    labels,
    datasets: [{ ...defaultStyle, ...style }],
  };
}

/**
 * Pega dados de um arquivo JSON no browser
 * @param {string} url - Caminho relativo do JSON (ex: './db/domains.json')
 * @param {string} key - (Opcional) chave para extrair do objeto JSON
 */
export async function getDatasetsToTabs(url, key) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro ao carregar ${url}`);
    const data = await res.json();
    return key ? data[key] || [] : data;
  } catch (err) {
    console.error(`Erro ao carregar ${url}:`, err);
    return [];
  }
}
