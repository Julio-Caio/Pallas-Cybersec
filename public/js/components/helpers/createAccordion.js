// Função para criar accordion cards
export function createAccordion(containerId, items, type) {
  const accordion = document.getElementById(containerId);
  items.forEach((item, index) => {
    const itemId = `${containerId}-collapse${index}`;
    const card = `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${containerId}-heading${index}">
          <button class="accordion-button collapsed bg-dark text-light fw-semibold" type="button"
            data-bs-toggle="collapse" data-bs-target="#${itemId}" aria-expanded="false"
            aria-controls="${itemId}">
            ${
              type === "record"
                ? `${item.name} | <span class="record-type">${item.type}</span>`
                : item
            }
          </button>
        </h2>
        <div id="${itemId}" class="accordion-collapse collapse" aria-labelledby="${containerId}-heading${index}"
          data-bs-parent="#${containerId}">
          <div class="accordion-body bg-dark-subtle text-dark rounded-bottom">
            ${
              type === "record"
                ? `<p><strong>Type:</strong> ${item.type}</p><p><strong>Address:</strong> ${item.value}</p>`
                : `<p>${type.toUpperCase()}: ${item}</p>`
            }
          </div>
        </div>
      </div>`;
    accordion.innerHTML += card;
  });
}
