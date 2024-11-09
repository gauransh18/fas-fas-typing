const randomQuoteAPI_URL = 'http://api.quotable.io/quotes/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const newQuoteButton = document.getElementById('newQuoteButton');

let timerStarted = false;
let timerInterval;

quoteInputElement.addEventListener('input', () => {
  if (!timerStarted && quoteInputElement.value.length > 0) {
    startTimer();
    timerStarted = true;
  }

  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');
  let correct = true;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct', 'incorrect');
      correct = false;
    } else if (character == characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });

  if (correct) {
    displaySpeed();
    clearInterval(timerInterval); // Stop the timer
    timerStarted = false; // Reset for the next test

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Update progress bar
  const progress = (arrayValue.length / arrayQuote.length) * 100;
  document.getElementById('progressBar').style.width = `${progress}%`;
});

function displaySpeed() {
  const timeTaken = getTimerTime();
  timerElement.innerText = timeTaken;
  const words = quoteDisplayElement.innerText.split(' ').length;
  const speed = Math.round((words / timeTaken) * 60);
  alert(`Your typing speed is ${speed} WPM`);
}

function getRandomQuote() {
  return fetch(randomQuoteAPI_URL)
    .then((response) => response.json())
    .then((data) => data[0].content); //[0]
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  console.log(quote);
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach((character) => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
}

let startTime;
function startTimer() {
  timerElement.innerText = 0;
  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

restartButton.addEventListener('click', () => {
  quoteInputElement.value = '';
  clearInterval(timerInterval);
  timerElement.innerText = '0'; // Reset timer display
  timerStarted = false; // Reset timer started flag

  // Reset progress bar
  document.getElementById('progressBar').style.width = '0%';
});

newQuoteButton.addEventListener('click', () => {
  document.getElementById('progressBar').style.width = '0%';
  clearInterval(timerInterval);
  timerElement.innerText = '0'; // Reset timer display
  timerStarted = false; // Reset timer started flag

  renderNewQuote();
});

renderNewQuote();

document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
