const input = document.querySelector('input');
const btn = document.querySelector('button');
const dictionary = document.querySelector('.dictionary-app');

// Function to fetch data from the API
async function dictionaryFn(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const data = await res.json();
  return data[0];
}

// Event listener for button click
btn.addEventListener('click', fetchAndCreateCard);

async function fetchAndCreateCard() {
  const word = input.value; // Get the input word
  const data = await dictionaryFn(word); // Fetch word data
  console.log(data);

  if (!data) {
    dictionary.innerHTML = `<div class="error">Word not found.</div>`;
    return;
  }

  // Collect part of speech information
  let partOfSpeechArray = [];
  for (let i = 0; i < data.meanings.length; i++) {
    partOfSpeechArray.push(data.meanings[i].partOfSpeech);
  }

  // Create HTML for the dictionary card
  dictionary.innerHTML = `
    <div class="card">
      <div class="property">
      <span>Word:</span>
        <span>${data.word}</span>
      </div>
      <div class="property">
        <span>Phonetics:</span>
        <span>${data.phonetic || 'No phonetic available'}</span>
      </div>
      <div class="property">
        <span>Audio:</span>
        ${data.phonetics && data.phonetics[0] ? 
          `<audio controls src="${data.phonetics[0].audio}"></audio>` 
          : 'No audio available'}
      </div>
      <div class="property">
        <span>Definitions:</span>
        <ul>
          ${data.meanings.map(meaning => `
            <li>
              <strong>${meaning.partOfSpeech}</strong>: ${meaning.definitions[0].definition}
              <br>
              <em>Example: ${meaning.definitions[0].example || 'No example available'}</em>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="property">
        <span>Parts of Speech:</span>
        <span>${partOfSpeechArray.join(', ')}</span>
      </div>
    </div>
  `;
}
