export class WgChip extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
    this.addListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick);
  }

  #render(): void {
    if (this.shadowRoot) {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            --background-color: black;
            --text-color: white;
            --border-radius: 4px;
          }
          div {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem;
            width: 150px;
            background: var(--background-color);
            border-radius: var(--border-radius);
            color: var(--text-color);
          }
          span:nth-child(1) {
            margin-right: .5rem;
          }
          span:nth-child(2) {
            border-left: 1px solid white;
            padding-left: 0.5rem;
            cursor: pointer;
          }
        </style>
        <div>
          <span>${this.getAttribute('text')}</span>
          <span id="remove">&times;</span>
        </div>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  onClick(): void {
    const onClick = new CustomEvent('wg-on-click', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: this.getAttribute('text'),
    });
    this.dispatchEvent(onClick);
  }

  addListeners(): void {
    this.shadowRoot
      ?.getElementById('remove')
      ?.addEventListener('click', this.onClick.bind(this));
  }
}

customElements.define('wg-chip', WgChip);
