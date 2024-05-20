import { medicinesList, saveToStorage, renderFilterList, renderMedicinesList, filterMedicineInputDisplay } from "./ui.js";
import { populateInputFieldsFromSpeech} from "./utils/speechutils.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const nameInputElement = document.getElementById('nameInput');
export const dateInputElement = document.getElementById('dateInput');
export const descriptionInputElement = document.getElementById('descriptionInput');
export const quantityInputElement = document.getElementById('quantityInput');
export const nameFilterElement = document.getElementById('filterNameInput');
export const dateFilterElement = document.getElementById('filterDateInput');
const imageInputElement = document.getElementById('imageInput');
const speechButton = document.querySelector('.js-speech-button');



export function applyFilter() {
  const nameFilter = nameFilterElement.value.toLowerCase();
  const dateFilter = dateFilterElement.value;


  const filteredMedicines = medicinesList.filter(medicines => {
    const nameMatch = medicines.name.toLowerCase().includes(nameFilter);
    const dateMatch = medicines.dueDate.includes(dateFilter); 

    return nameMatch && dateMatch;});

    nameFilterElement.value = '';
    dateFilterElement.value = '';


    renderFilterList(filteredMedicines);
 };

  export  function deleteMedicines (index) {
    console.log('delete button:', medicinesList);
    medicinesList.splice(index, 1);
    saveToStorage();
    renderMedicinesList();
    //checkDueDates();
    applyFilter();
    filterMedicineInputDisplay.innerHTML = '';
  }
        
  export function editMedicines(index) {
    
    const medicinesToEdit = medicinesList[index];

    populateInputFields(medicinesToEdit);
    console.log('populate:', medicinesToEdit);
    deleteMedicines(index);
    //checkDueDates();
    
    
    function populateInputFields(medicines) {
      nameInputElement.value = medicines.name;
      
      dateInputElement.value = medicines.dueDate;
      
      descriptionInputElement.value = medicines.description;

    
      quantityInputElement.value = medicines.quantity;
    }


  };



 export function resetInputFields() {
    nameInputElement.value = '';
    descriptionInputElement.value = '';
    dateInputElement.value = '';
    imageInputElement.value = '';
    quantityInputElement.value = '';
  }


  export function addMedicines() {
    

    console.log(medicinesList);
   

    const name = nameInputElement.value;
  
    const dueDate = dateInputElement.value;
    
    const description = descriptionInputElement.value;
  
    const imageFile = imageInputElement.files[0];
  
    const quantity = quantityInputElement.value;

    if (!name || !dueDate) {
      alert("Please fill in both brand name and due date fields.");
      return; 
    }

    /*
    if (imageFile){
      const url = URL.createObjectURL(imageFile);

      fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = function(e){
          const imageUrl = e.target.result;
          medicinesList.push({ name, dueDate, description, imageUrl, quantity });
          saveToStorage();
          resetInputFields();
          renderMedicinesList(); 
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => console.error('error converting', error));

      URL.revokeObjectURL(url);
    }
    */
    

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const imageUrl = e.target.result;
        medicinesList.push({ name, dueDate, description, imageUrl, quantity });
        saveToStorage();
        resetInputFields();
        renderMedicinesList(); 
      };
      reader.readAsDataURL(imageFile);
    } else {
      medicinesList.push({ name, dueDate, description, imageUrl: '', quantity });
      saveToStorage();
      resetInputFields();
      renderMedicinesList();
     
    }
    

  }

  
  
    

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; 
    
  
    recognition.onresult = function(event) {
  
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
    
      populateInputFieldsFromSpeech(transcript); 
      
      };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
    };
    
    
    
    speechButton.addEventListener('click', () => {
      recognition.start();
      speechButton.classList.add('speech-button-pressed');
    });
    
    recognition.onend = function() {
     
      speechButton.classList.remove('speech-button-pressed');
    };



  

  
    
  
  

