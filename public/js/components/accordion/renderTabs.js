function renderTabsAndAccordions(jsonData, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const tabButtonsDiv = document.createElement("div");
  tabButtonsDiv.className = "tab";

  const tabContainer = document.createElement("div");
  tabContainer.className = "tab-container";

  const fieldsToRender = ["domains", "hostnames", "ip", "org"];

  Object.entries(jsonData)
    .filter(([key]) => fieldsToRender.includes(key))
    .forEach(([key, items], index) => {
      const tabButton = createTabHeader(key);
      tabButton.addEventListener("click", () => openTab(key));
      tabButtonsDiv.appendChild(tabButton);

      const tabContent = createTabContent(key);
      const accordion = document.createElement("div");
      accordion.className = "accordion";
      accordion.id = `accordion-${key}`;

      // Renderizar DOMÍNIOS com SUBDOMÍNIOS
      if (key === "domains") {
        items.forEach((domain, idx) => {
          const domainId = `${key}-${idx}`;
          const accordionItem = document.createElement("div");
          accordionItem.className = "accordion-item";

          const header = document.createElement("h2");
          header.className = "accordion-header";

          const button = document.createElement("button");
          button.className = "accordion-button collapsed";
          button.type = "button";
          button.setAttribute("data-bs-toggle", "collapse");
          button.setAttribute("data-bs-target", `#collapse-${domainId}`);
          button.setAttribute("aria-expanded", "false");
          button.setAttribute("aria-controls", `collapse-${domainId}`);
          button.innerText = domain.value;

          header.appendChild(button);
          accordionItem.appendChild(header);

          // Corpo do domínio
          const collapseDiv = document.createElement("div");
          collapseDiv.id = `collapse-${domainId}`;
          collapseDiv.className = "accordion-collapse collapse";

          const bodyDiv = document.createElement("div");
          bodyDiv.className = "accordion-body";

          // Informações do domínio principal
          bodyDiv.innerHTML = `
            <strong>Domínio:</strong> ${domain.value}<br>
            <strong>Endereço:</strong> ${domain.address || "—"}<br>
            <strong>Portas:</strong> ${domain.ports || "—"}<br>
          `;

          // Subaccordion (subdomínios)
          if (domain.subdomains && domain.subdomains.length > 0) {
            const subAccordion = document.createElement("div");
            subAccordion.className = "accordion mt-3";
            subAccordion.id = `subaccordion-${domainId}`;

            domain.subdomains.forEach((sub, i) => {
              const subItemId = `${domainId}-sub-${i}`;
              const subItem = document.createElement("div");
              subItem.className = "accordion-item";

              // Cabeçalho do subdomínio
              const subHeader = document.createElement("h2");
              subHeader.className = "accordion-header";

              const subButton = document.createElement("button");
              subButton.className = "accordion-button collapsed";
              subButton.type = "button";
              subButton.setAttribute("data-bs-toggle", "collapse");
              subButton.setAttribute("data-bs-target", `#collapse-${subItemId}`);
              subButton.innerText = sub.value;

              subHeader.appendChild(subButton);
              subItem.appendChild(subHeader);

              // Corpo do subdomínio
              const subCollapse = document.createElement("div");
              subCollapse.id = `collapse-${subItemId}`;
              subCollapse.className = "accordion-collapse collapse";

              const subBody = document.createElement("div");
              subBody.className = "accordion-body";

              subBody.innerHTML = `
                <strong>Endereço:</strong> ${sub.address || domain.address || "—"}<br>
                <strong>Portas:</strong> ${sub.ports || domain.ports || "—"}<br>
              `;

              subCollapse.appendChild(subBody);
              subItem.appendChild(subCollapse);
              subAccordion.appendChild(subItem);
            });

            bodyDiv.appendChild(subAccordion);
          } else {
            bodyDiv.innerHTML += `<em>Sem subdomínios encontrados.</em>`;
          }

          collapseDiv.appendChild(bodyDiv);
          accordionItem.appendChild(collapseDiv);
          accordion.appendChild(accordionItem);
        });
      } else {
        // 🔹 Renderiza outros campos (ip_str, org)
        items.forEach((item, i) => {
          const itemId = `${key}-${i}`;
          const accordionItem = document.createElement("div");
          accordionItem.className = "accordion-item";

          const header = document.createElement("h2");
          header.className = "accordion-header";

          const button = document.createElement("button");
          button.className = "accordion-button collapsed";
          button.type = "button";
          button.setAttribute("data-bs-toggle", "collapse");
          button.setAttribute("data-bs-target", `#collapse-${itemId}`);
          button.innerText = item.value || item;

          header.appendChild(button);
          accordionItem.appendChild(header);

          const collapseDiv = document.createElement("div");
          collapseDiv.id = `collapse-${itemId}`;
          collapseDiv.className = "accordion-collapse collapse";
          accordionItem.appendChild(collapseDiv);
          accordion.appendChild(accordionItem);
        });
      }

      tabContent.appendChild(accordion);
      tabContainer.appendChild(tabContent);

      if (index === 0) {
        tabButton.classList.add("active");
        tabContent.style.display = "block";
      }
    });

  container.appendChild(tabButtonsDiv);
  container.appendChild(tabContainer);

  // Funções auxiliares
  function openTab(tabName) {
    const contents = container.querySelectorAll(".tabcontent");
    const buttons = container.querySelectorAll(".tablinks");

    contents.forEach((el) => (el.style.display = "none"));
    buttons.forEach((el) => el.classList.remove("active"));

    const target = document.getElementById(`$tab-${tabName}`);
    if (target) target.style.display = "block";

    buttons.forEach((b) => {
      if (b.innerText === tabName) b.classList.add("active");
    });
  }

  function createTabHeader(title) {
    const button = document.createElement("button");
    button.className = "tablinks";
    button.innerText = title;
    return button;
  }

  function createTabContent(name) {
    const content = document.createElement("div");
    content.className = "tabcontent";
    content.id = `$tab-${name}`;
    return content;
  }
}

export { renderTabsAndAccordions };
