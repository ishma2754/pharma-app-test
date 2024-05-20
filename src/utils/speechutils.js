import { nameInputElement, dateInputElement, descriptionInputElement, quantityInputElement, nameFilterElement, dateFilterElement } from '../action.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


export function populateInputFieldsFromSpeech(transcript) {

  if (transcript.includes('filter brand name')) {
    nameFilterElement.value = extractValue(transcript, 'filter brand name');
  
  } else if (transcript.includes('filter due date')) {
    handleDueDateFilter(transcript);
  
  } else if (transcript.includes('filter due date in')) {
    handleDueDateInFilter(transcript);
  
  } else if (transcript.includes('brand name')) {
    nameInputElement.value = extractValue(transcript, 'brand name');
  
  } else if (transcript.includes('due date')) {
    handleDueDate(transcript);
  
  } else if (transcript.includes('quantity')) {
    const quantity = extractValue(transcript, 'quantity');
    quantityInputElement.value = quantity;
  
  } else if (transcript.includes('description')){
    const description = extractValue(transcript, 'description');
    descriptionInputElement.value = description;
  }

  function handleDueDateFilter(transcript) {
    const dueDate = extractValue(transcript, 'filter due date');
    const formattedDueDate = convertDueDate(transcript);
    if (formattedDueDate) {
      dateFilterElement.value = formattedDueDate;
    } else {
      console.error('Invalid due date format detected in transcript:', dueDate);
    }
  }
  
  function handleDueDateInFilter(transcript) {
    const days = extractValue(transcript, 'filter due date in');
    if (!isNaN(days)) {
      const dueDate = convertDueDate(transcript);
      dateFilterElement.value = dueDate;
    } else {
      console.error('Invalid number of days detected in the transcript:', days);
    }
  }
  
  function handleDueDate(transcript) {
    const formattedDueDate = convertDueDate(transcript);
    if (formattedDueDate) {
      dateInputElement.value = formattedDueDate;
    } else {
      console.error('Invalid due date format detected in transcript:', extractValue(transcript, 'due date'));
    }
  }

  function extractValue(text, keyword) {
    const keywordIndex = text.indexOf(keyword);
    if (keywordIndex !== -1) {
      return text.slice(keywordIndex + keyword.length).trim();
    }
    return '';
  }

  
};



function convertDueDate(transcript) {

  const relativeDateRegex = /in\s+(\d+)\s+days?/i;
  const relativeDateMatch = transcript.match(relativeDateRegex);

  if (relativeDateMatch) {
    const daysToAdd = parseInt(relativeDateMatch[1]);
    const dueDate = dayjs().add(daysToAdd, 'day').format('YYYY-MM-DD');
    return dueDate;
  }

  const dateRegex = /(\d{1,2})(?:st|nd|rd|th)?\s*(?:of)?\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*(\d{2,4})/i;

 
  const match = transcript.match(dateRegex);
  if (match) {
    const day = parseInt(match[1]);
    const monthName = match[2];
    const year = parseInt(match[3]);

    
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    const monthIndex = months.indexOf(monthName.toLowerCase()) + 1;

    
    if (!isNaN(day) && !isNaN(monthIndex) && !isNaN(year)) {
      
      const date = new Date(year, monthIndex - 1, day);
      return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } else {
      alert('Invalid month name detected in the transcript.');
      return null;
    }
  } else {
    alert('The transcript does not consist of a complete date (day, month, and year).');
    return null;
  }

 
  };
