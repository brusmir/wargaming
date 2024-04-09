import {STATE} from '../state/state';
import {WgElement} from '../state/wg-element.model';

export class WgModal extends HTMLElement {
  elements: Array<WgElement> | undefined;
  selectedElements: Array<WgElement> | undefined;
  changedElements: Array<WgElement> = [];
  searchParam = '';
  selectParam = 300;
  constructor() {
    super();
  }

  connectedCallback(): void {
    this.attachShadow({mode: 'open'});
    this.#render();
    this.addListeners();
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.onDismiss);
    this.removeEventListener('wg-on-search', this.filterElementList);
    this.removeEventListener('wg-on-check', this.updateElementList);
    this.removeEventListener('wg-on-select', this.filterElementList);
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
          --backdrop-background-color: rgba(0,0,0,0.20);
          --background-color: #373737;
          --text-color: white;
          --border-radius: 4px;
        }

        :host([opened]) #backdrop, :host([opened]) #modal {
          display: block;
        }

        #backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 100vh;
          background-color: var(--backdrop-background-color);
          display: none;
        }
        #modal {
          position: fixed;
          top: 15vh;
          left: 25%;
          width: 50%;
          height: 70vh;
          z-index: 100;
          padding: 2rem;
          border-radius: var(--border-radius);
          background-color: var(--background-color);
          color: var(--text-color);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          display: none;

          header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;

            span {
              cursor: pointer;
            }
          }

          #main {
            div {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1.5rem;
            }

            div:nth-child(2) {
              height: calc(70vh - 4rem - 84px - 56px - 100px - 56px);
              overflow: auto;
            }
          }

          #selected-items {
            display: flex;
            flex-direction: column;
            margin-top: 1.5rem;
          }

          #action {
            margin-top: 1.5rem;

            wg-button {
              margin-right: 1rem;
            }
          }
        }
      </style>
        <div id='backdrop'></div>
        <div id='modal'>
          <header>
            <h3>Select Items</h3>
            <span id="close-icon">&times;</span>
          </header>
          <section id="main">
            <div>
              <wg-search></wg-search>
              <wg-select></wg-select>
            </div>
            <div>
              <wg-list></wg-list>
            </div>
          </section>
          <section id="selected-items">
            <span>Current selected items:</span>
            <div>
              <wg-chip-list>/<wg-chip-list>
            </div>
          </section>
          <section id="action">
            <wg-button text="Save" color="success" id="save-btn"></wg-button>
            <wg-button text="Cancel" color="warning" id="cancel-btn"></wg-button>
          </section>
        </div>
      `;
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this.setWgListAttributes(this.elements);
      this.setWgChipListAttribute();
    }
  }

  filterElementList(): void {
    if (this.elements) {
      let filteredElements = [...this.elements];
      if (this.searchParam) {
        filteredElements = filteredElements?.filter(element =>
          element.label.toLowerCase().includes(this.searchParam.toLowerCase())
        );
      }

      if (this.selectParam) {
        filteredElements = filteredElements.slice(0, this.selectParam);
      }

      this.setWgListAttributes(filteredElements);
    }
  }

  updateElementList(event: any): void {
    const selectedElement = event.detail;
    this.elements = this.elements?.map(element =>
      element.id === selectedElement.id ? selectedElement : element
    );
    this.selectedElements = this.elements?.filter(element => element.state);

    this.setChangedElements(selectedElement);

    this.shadowRoot
      ?.querySelector('wg-list')
      ?.setAttribute(
        'disabled',
        this.selectedElements?.length === 3 ? 'true' : 'false'
      );

    this.setWgChipListAttribute();
  }

  setChangedElements(selectedElement: WgElement) {
    const index = this.changedElements.findIndex(
      el => el.id === selectedElement.id
    );

    if (index !== -1) {
      this.changedElements[index] = selectedElement;
    } else {
      this.changedElements.push(selectedElement);
    }
  }

  setWgListAttributes(elements: Array<WgElement>): void {
    this.shadowRoot
      ?.querySelector('wg-list')
      ?.setAttribute('items', JSON.stringify(elements));
    this.shadowRoot
      ?.querySelector('wg-list')
      ?.setAttribute(
        'disabled',
        this.selectedElements?.length === 3 ? 'true' : 'false'
      );
  }

  setWgChipListAttribute(): void {
    this.shadowRoot
      ?.querySelector('wg-chip-list')
      ?.setAttribute('chips', JSON.stringify(this.selectedElements));
  }

  onDelete(event: any): void {
    event.stopPropagation();
    this.elements = this.elements?.map(element =>
      element.label === event.detail ? {...element, state: false} : element
    );
    this.selectedElements = this.elements?.filter(element => element.state);

    const selectedElement = this.elements?.filter(
      el => el.label === event.detail
    )[0];

    if (selectedElement) {
      this.setChangedElements(selectedElement);
    }

    this.setWgChipListAttribute();

    this.filterElementList();
  }

  onDismiss(): void {
    if (this.changedElements.length) {
      STATE.updateElements(this.changedElements);
    }
    const onClose = new CustomEvent('wg-on-dismiss', {
      bubbles: true,
      composed: true,
      detail: this.changedElements?.length,
    });
    this.dispatchEvent(onClose);
  }

  open(): void {
    this.setAttribute('opened', '');
  }

  addListeners(): void {
    this.shadowRoot
      ?.getElementById('close-icon')
      ?.addEventListener('click', this.onDismiss.bind(this));
    this.shadowRoot
      ?.getElementById('cancel-btn')
      ?.addEventListener('click', this.onDismiss.bind(this));
    this.shadowRoot
      ?.getElementById('save-btn')
      ?.addEventListener('click', this.onDismiss.bind(this));

    this.addEventListener('wg-on-search', (event: any) => {
      this.searchParam = event.detail;
      this.filterElementList();
    });

    this.addEventListener('wg-on-check', (event: any) => {
      this.updateElementList(event);
    });

    this.addEventListener('wg-on-select', (event: any) => {
      this.selectParam = +event.detail;
      this.filterElementList();
    });

    this.shadowRoot
      ?.querySelector('wg-chip-list')
      ?.addEventListener('wg-on-click', this.onDelete.bind(this));
  }
}

customElements.define('wg-modal', WgModal);
