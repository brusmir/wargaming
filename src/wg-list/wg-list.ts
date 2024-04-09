import {WgElement} from '../state/wg-element.model';

export class WgList extends HTMLElement {
  static observedAttributes = ['items', 'disabled'];
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick);
  }

  #render(items: Array<WgElement>): void {
    if (this.shadowRoot && items) {
      let list = '<ul>';
      for (const item of items) {
        list += `<li>
          <input 
            type="checkbox" 
            id="${item.id}" 
            name="${item.label}" 
            value="${item.state}" 
            ${item.state ? 'checked' : ''}
          >
          <label for="${item.id}">${item.label}</label><br>
        </li>`;
      }
      list += '</ul>';

      this.shadowRoot.innerHTML = '';
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            --background-color: black;
            --text-color: white;
            --border-radius: 4px;

            width: 100%;
            height: 100%;
          }
          ul {
            list-style-type: none;
            margin: 0;
            padding: 1rem;
            background-color: var(--background-color);
            color: var(--text-color);
            border-radius: var(--border-radius);

            li {
              display: flex;

              &:not(:last-child) {
                margin-bottom: 10px;
              }

              label {
                margin-left: 1rem;
                flex-grow: 1;
              }
            }
          }
        </style>
        ${list}
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (name === 'items' && oldValue !== newValue) {
      this.#render(JSON.parse(newValue));
    }

    if (name === 'disabled') {
      this.disableCheckboxes(JSON.parse(newValue));
    }

    this.addListeners();
  }

  disableCheckboxes(value: boolean): void {
    this.shadowRoot?.querySelectorAll('input')?.forEach(checkbox => {
      checkbox.disabled = value;
    });
  }

  onClick(event: any): void {
    const {checked: state, id, name: label} = event.target;
    const element = {id: +id, label, state};
    this.dispatchEvent(
      new CustomEvent('wg-on-check', {
        bubbles: true,
        composed: true,
        detail: element,
      })
    );
  }

  addListeners(): void {
    this.shadowRoot
      ?.querySelector('ul')
      ?.addEventListener('click', (event: any) => {
        if (event.target.tagName === 'INPUT') {
          this.onClick(event);
        }
      });
  }
}

customElements.define('wg-list', WgList);
