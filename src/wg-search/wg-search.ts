export class WgSearch extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
    this.addListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener('input', this.onInput);
  }

  #render(): void {
    if (this.shadowRoot) {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          input {
            width: 150px;
            height: 2rem;
            box-sizing: border-box;
          }
        </style>
        <div>
          <span>Search</span>
          <input type='text'/>
        </div>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  onInput(event: any): void {
    const onSearch = new CustomEvent('wg-on-search', {
      bubbles: true,
      composed: true,
      detail: event.target.value,
    });
    this.dispatchEvent(onSearch);
  }

  addListeners(): void {
    this.shadowRoot
      ?.querySelector('input')
      ?.addEventListener('input', this.onInput.bind(this));
  }
}

customElements.define('wg-search', WgSearch);
