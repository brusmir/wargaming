import {WgElement} from './wg-element.model';

const elementsArray: Array<WgElement> = Array.from(
  {length: 300},
  (_, index) => ({
    id: index,
    state: false,
    label: `Element ${index + 1}`,
  })
);

class State {
  private elements: Array<WgElement> = elementsArray;

  getElements(): Array<WgElement> {
    return this.elements;
  }

  updateElements(...changedArrays: Array<Array<WgElement>>) {
    changedArrays.forEach(changedArray => {
      changedArray.forEach(updatedElement => {
        const index = this.elements.findIndex(
          element => element.id === updatedElement.id
        );
        if (index !== -1) {
          this.elements[index] = updatedElement;
        }
      });
    });
  }

  getSelectedElements(): Array<WgElement> {
    return this.elements.filter(element => element.state);
  }
}

export const STATE = new State();
