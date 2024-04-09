export class WgButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
  }

  #render(): void {
    if (this.shadowRoot) {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            --success-background-color: green;
            --warning-background-color: red;
            --text-color: white;
            --border-radius: 4px;
          }
          button {
            border: none;
            padding: 0.3rem 1rem;
            cursor: pointer;
            border-radius: var(--border-radius);
            height: 2rem;
            box-sizing: border-box;
            color: var(--text-color);
          }
          .success {
            background-color: var(--success-background-color);
          }
          .warning {
            background-color: var(--warning-background-color);
          }
        </style>
        <button class="${this.getAttribute('color')}">
          ${this.getAttribute('text')}
        </button>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('wg-button', WgButton);
