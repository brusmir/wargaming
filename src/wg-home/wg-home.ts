import {STATE} from '../state/state';
import {WgElement} from '../state/wg-element.model';
import {WgModal} from '../wg-modal/wg-modal';

export class WgHome extends HTMLElement {
  elements: Array<WgElement> | undefined;
  selectedElements: Array<WgElement> | undefined;
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onClick);
    this.removeEventListener('wg-on-dismiss', this.onDismiss);
    this.removeEventListener('wg-on-click', this.onDelete);
  }

  #render(): void {
    if (this.shadowRoot) {
      this.elements = STATE.getElements();
      this.selectedElements = STATE.getSelectedElements();

      this.shadowRoot.innerHTML = '';
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: sans-serif;
            margin: 3rem;
          }
          #selected-items {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;

            div {
              display: flex;
              margin-top: 1.5rem;
            }
          }
        </style>
        <section id='header'>
          <h1>Select items</h1>
        </section>
        <section id='selected-items'>
          <span>Your currently have ${this.selectedElementsLength()} selected items</span>
          <div>
            <wg-chip-list>/<wg-chip-list>
          </div>
        </section>
        <section id="actions">
          <wg-button text="Change my choice" color="success" id="btn"></wg-button>
        </section>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.setWgChipListAttribute();
      this.addListeners();
    }
  }

  selectedElementsLength(): number | undefined {
    return this.selectedElements?.length;
  }

  setWgChipListAttribute(): void {
    this.shadowRoot
      ?.querySelector('wg-chip-list')
      ?.setAttribute('chips', JSON.stringify(this.selectedElements));
  }

  onDismiss(event: any): void {
    const child = this.shadowRoot?.querySelector('wg-modal');
    if (child) {
      this.shadowRoot?.removeChild(child);
    }
    if (event.detail) {
      this.#render();
    }
  }

  onClick(): void {
    const modal = document.createElement('wg-modal') as WgModal;
    this.shadowRoot?.appendChild(modal);
    modal?.open();
  }

  onDelete(event: any): void {
    const elementId = +event.detail.split(' ')[1] - 1;
    STATE.updateElements([
      {
        id: elementId,
        label: event.detail,
        state: false,
      },
    ]);
    this.#render();
  }

  addListeners(): void {
    this.shadowRoot
      ?.getElementById('btn')
      ?.addEventListener('click', this.onClick.bind(this));
    this.addEventListener('wg-on-dismiss', this.onDismiss.bind(this));
    this.addEventListener('wg-on-click', this.onDelete.bind(this));
  }
}

customElements.define('wg-home', WgHome);
