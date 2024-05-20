import { addMedicines } from '../action.js';
import { saveToStorage, renderMedicinesList } from '../ui.js';


// Mocking the DOM elements and their properties
document.body.innerHTML = `
  <input id="nameInput" value="Aspirin" />
  <input id="dateInput" value="2024-06-01" />
  <input id="descriptionInput" value="Pain reliever" />
  <input id="quantityInput" value="10" />
  <input id="imageInput" />
`;

// Access the mocked DOM elements
const nameInputElement = document.getElementById('nameInput');
const dateInputElement = document.getElementById('dateInput');
const descriptionInputElement = document.getElementById('descriptionInput');
const quantityInputElement = document.getElementById('quantityInput');
const imageInputElement = document.getElementById('imageInput');

// Mocking the saveToStorage and renderMedicinesList functions
jest.mock('../ui.js', () => ({
  saveToStorage: jest.fn(),
  renderMedicinesList: jest.fn(),
}));

describe('addMedicines', () => {
  test('should add a medicine to the list', () => {
    // Setting up the medicinesList
    const medicinesList = [];
    const expectedMedicine = {
      name: 'Aspirin',
      dueDate: '2024-06-01',
      description: 'Pain reliever',
      imageUrl: '',
      quantity: '10'
    };

    // Mocking file input
    const file = new Blob(['image content'], { type: 'image/png' });
    const fileReaderSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementation(function() {
      this.onload({ target: { result: 'data:image/png;base64,imagecontent' } });
    });
    imageInputElement.files = [file];

    // Calling the function to add the medicine
    addMedicines();

    // Verifying that the medicine was added
    expect(medicinesList).toContainEqual(expectedMedicine);
    expect(saveToStorage).toHaveBeenCalled();
    expect(renderMedicinesList).toHaveBeenCalled();

    // Clean up the FileReader mock
    fileReaderSpy.mockRestore();
  });
});