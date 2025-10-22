function createTab()
{
    let tab = document.createElement('div');
    tab.className = 'tab';
    return tab;
}

function createTabHeader(title)
{
    let button = document.createElement('button');
    button.className = 'tablinks';
    button.innerText = title;
    return button;
}

function createTabContent(name) // name: string
{
    // exemplo: 
    let content = document.createElement('div');
    content.className = 'tabcontent';
    content.id = `$tab-${name}`;
    return content;
}

function createAccordionItem(title) // title: string
{
    let accordion = document.createElement('div');
    accordion.className = 'accordion';
    let accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';
    let header = document.createElement('h2');
    header.className = 'accordion-header';
    let button = document.createElement('button');
    button.className = 'accordion-button collapsed';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#collapse-${title}`);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `collapse-${title}`);
    button.innerText = title;
    header.appendChild(button);
    accordionItem.appendChild(header);
}

function createAccordionContent(title, content) // title: string, content: HTMLElement
{
    let collapseDiv = document.createElement('div');
    collapseDiv.id = `collapse-${title}`;
    collapseDiv.className = 'accordion-collapse collapse';
    let bodyDiv = document.createElement('div');
    bodyDiv.className = 'accordion-body';
    bodyDiv.appendChild(content);
    collapseDiv.appendChild(bodyDiv);
    return collapseDiv;
}

export { createTab, createTabHeader, createTabContent, createAccordionItem, createAccordionContent };