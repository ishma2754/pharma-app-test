

import { applyFilter, deleteMedicines, editMedicines, addMedicines, resetInputFields, dateInputElement } from "./action.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then(function(registration) {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch(function(err) {
    console.log('Service Worker registration failed:', err);
  });
}

export const filterMedicineInputDisplay = document.querySelector('.js-filter-medicines');
const filterButton = document.querySelector('.js-filter-button');
const totalMedicineDisplay = document.querySelector('.js-total-medicines');
const earliestExpiryDisplay = document.querySelector('.js-earliest-expiry');
export const medicinesInputDisplay = document.querySelector('.js-medicines-grid-display');
const addButton = document.querySelector('.js-add-medicines-button');



const today = dayjs();
const todayDate = today.format('YYYY-MM-DD');
console.log(todayDate);


// Call the function to load data from storage
export const medicinesList = loadFromStorage();






function loadFromStorage() {
   return JSON.parse(localStorage.getItem('medicinesList')) || [];
  }
  

  function checkExpiryDates() {
    medicinesList.forEach(medicine => {
      if(dayjs(medicine.dueDate).isSame(todayDate, 'day')) {
        sendExpiryNotification(medicine);
      }
    });
  }
  
  // Function to send notifications
  function sendExpiryNotification(medicine) {
    if ('Notification' in window && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Medicine Expiry Alert', {
          body: `The medicine ${medicine.name} has expired today.`,
         // Customize this path as needed
          tag: medicine.name // A unique identifier is good for deduplication
        });
      });
    } else {
      console.log('Notification permission not granted');
    }
  }
  




document.addEventListener('DOMContentLoaded', () => {
  const dateInputs = document.querySelectorAll('.js-due-date-input, .js-filter-date-input');


  dateInputs.forEach(input => {
    input.addEventListener('focus', function() {
      if (this.type === 'text') {
        this.type = 'date';
        this.value = '';
      }
    });

    input.addEventListener('blur', function() {
      if (!this.value) {
        this.type = 'text';
        this.value = '';
        this.placeholder = this.getAttribute('data-placeholder');
      }
    });

    // Initialize the inputs
    if (!input.value) {
      input.type = 'text';
      input.placeholder = input.getAttribute('data-placeholder');
    }
  });


  checkExpiryDates();
});






renderMedicinesList();

//checkDueDates();




filterButton.addEventListener('click', () => {

  filterMedicineInputDisplay.innerHTML = '';
  applyFilter();

});



export function renderFilterList(filteredMedicines = medicinesList) {
  const filterListHTML = filteredMedicines.map((medicinesObject, index) => {
    const { name, dueDate, description, imageUrl, quantity } = medicinesObject;
    return `
      <div class="details">
      <div class="brand-name-display">${name}</div> 
      <div class="due-date-name-display">${dueDate}</div>
      <div class="description-display">${description}</div>
      <div class="image-container">${imageUrl ? `<img width="220" src="${imageUrl}" alt="medicine-Image">` : 'No Image'}</div>
      <div class="quantity-display">${quantity} quantity</div>
      </div>`;
  }).join('');

   filterMedicineInputDisplay.innerHTML = filterListHTML;
}



  function renderSummary(medicinesList) {
    const totalMedicines = medicinesList.length;
    totalMedicineDisplay.textContent = totalMedicines;
  
    const earliestMedicines = findEarliestDueMedicines(medicinesList);
    if (earliestMedicines) {
      earliestExpiryDisplay.innerHTML = `Earliest Expiry:   <span class="earliest-name">${earliestMedicines.name}</span>, Due on: <span class="earliest-date">${earliestMedicines.dueDate}</span>`;
     
    } else {
      earliestExpiryDisplay.innerHTML = `<span class="earliest-name">No medicines found.</span>`;
    }
  }
  
  function findEarliestDueMedicines(medicinesList) {
    if (medicinesList.length === 0) {
      return null;
    }
  
    return medicinesList.reduce((earliest, currentMedicines) => {
      const earliestDueDate = dayjs(earliest.dueDate);
      const currentDueDate = dayjs(currentMedicines.dueDate);
      return earliestDueDate.isBefore(currentDueDate) ? earliest : currentMedicines;
  });
  }
  
  renderSummary(medicinesList);

export function renderMedicinesList() {
  const medicinesListHTML = medicinesList.map((medicinesObject, index) => {
    const { name, dueDate, description, imageUrl, quantity  } = medicinesObject;

    const dueDateObj = dayjs(dueDate);

    const isDue = dueDateObj.isBefore(todayDate, 'day'); 
   
    const isToday = dueDateObj.isSame(todayDate, 'day'); 
    

    let expiredClass = '';
    if (isDue) {
      expiredClass = 'expired';
    } else if (isToday) {
      expiredClass = 'due-today';
    }


    return `
    <div class="details  ${expiredClass}">
      <div class="brand-name-display">${name}</div> 
      <div class="due-date-name-display">${dueDate}</div>
      <div class="description-display">${description}</div>
      <div class="image-container">${imageUrl ? `<img src="${imageUrl}" alt="medicine-Image">` : 'No Image'}</div>
      <div class="quantity-display">${quantity} quantity</div>
      <button class="delete-medicines-button js-delete-medicines-button">Delete</button>
      <button class="edit-medicines-button js-edit-medicines-button">Edit</button>
    </div>
      `;
  }).join(''); 

  medicinesInputDisplay.innerHTML = medicinesListHTML;

  renderSummary(medicinesList);



  

  document.querySelectorAll('.js-delete-medicines-button').forEach((deleteButton, index) => {
   deleteButton.addEventListener('click', () => {
      deleteMedicines(index);
   });
  });

  document.querySelectorAll('.js-edit-medicines-button').forEach((editButton, index) => {
   editButton.addEventListener('click', () => {
      editMedicines(index);
   });
  });
};


 addButton.addEventListener('click', () => {
    addMedicines();
    
   
 });


 export function saveToStorage (){
  localStorage.setItem('medicinesList', JSON.stringify(medicinesList));
 }



/*
export function checkDueDates() {
  
  notifications.forEach(notification => notification.close());
  notifications = [];

  

  medicinesList.forEach(medicine => {
    const dueDate = dayjs(medicine.dueDate);
    if (dueDate.isSame(todayDate, 'day')) {
      const notification = new Notification(`Due date is today for ${medicine.name}`);
      notifications.push(notification);
    } else if (dueDate.isBefore(todayDate, 'day')) {
      const notification = new Notification(`The due date has passed for ${medicine.name}.`);
      notifications.push(notification);
    }
  });

 
}

*/
 

