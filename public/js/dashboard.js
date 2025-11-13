const containerCard = document.querySelector("#container-card");
const containerTitle = document.querySelector('#container-title');

const aside = document.querySelector('aside');

function createCard(component, number, desc) {
  if (!number || typeof number === null || typeof number === undefined) {
    number = "-/-";
  }
  const cardElement = document.createElement("div");
  cardElement.classList.add("item-card");

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("item-card-body");

  const link = document.createElement("a");
  link.href = "#inventory";
  link.title = "Mais informações";

  const title = document.createElement("h2");
  title.innerText = number;

  const text = document.createTextNode(` ${desc} `);
  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-info-circle-fill");

  link.appendChild(title);
  link.appendChild(text);
  link.appendChild(icon);
  cardBodyElement.appendChild(link);
  cardElement.appendChild(cardBodyElement);

  if (component) {
    component.appendChild(cardElement);
  }

  return cardElement;
}

const container = document.getElementById("container-card");
container.appendChild(createCard(container, 20, "Banco de Dados"));
container.appendChild(createCard(container, 9, "Domínios"));
container.appendChild(createCard(container, 9, "Endereços IPs"));
container.appendChild(createCard(container, 9, "Capturas de Tela"));