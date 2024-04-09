import {WgElement} from '../state/wg-element.model';

export class WgChipList extends HTMLElement {
  static observedAttributes = ['chips'];
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
  }

  #render(items: Array<WgElement>): void {
    let wgChip = '';
    for (const item of items) {
      wgChip += `<wg-chip text="${item.label}"></wg-chip>`;
    }
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            display: flex;
            margin-top: 0.5rem;
            max-height: 70px;
            overflow: auto;
            flex-wrap: wrap;
          }
          wg-chip {
            margin-right: 1rem;
            margin-bottom: 1rem;
          }
        </style>
        ${wgChip}
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'chips' && oldValue !== newValue) {
      this.#render(JSON.parse(newValue));
    }
  }
}

customElements.define('wg-chip-list', WgChipList);
