export class WgSelect extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
    this.addListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener('select', this.onChange);
  }

  #render(): void {
    if (this.shadowRoot) {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          select {
            width: 150px;
            height: 2rem;
            box-sizing: border-box;
          }
        </style>
        <div>
          <span>Filter</span>
          <select name="filter">
            <option value="">No filter</option>
            <option value="10">>10</option>
            <option value="100">>100</option>
            <option value="200">>200</option>
          </select>
        </div>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  onChange(): void {
    const onSelect = new CustomEvent('wg-on-select', {
      bubbles: true,
      composed: true,
      detail: this.shadowRoot?.querySelector('select')?.value,
    });
    this.dispatchEvent(onSelect);
  }

  addListeners(): void {
    this.shadowRoot
      ?.querySelector('select')
      ?.addEventListener('change', this.onChange.bind(this));
  }
}

customElements.define('wg-select', WgSelect);
