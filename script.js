const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const newQuoteButton = document.getElementById('newQuoteButton');
const speedDisplayElement = document.getElementById('speedDisplay');
const wpmElement = document.getElementById('wpm');
const progressBar = document.getElementById('progressBar');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

let timerStarted = false;
let timerInterval;
let startTime;

async function getRandomQuote() {
    try {
        const response = await fetch(RANDOM_QUOTE_API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Failed to fetch quote:', error);
        return 'An error occurred while fetching the quote. Please try again.';
    }
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerHTML = '';
    quote.split('').forEach(character => {
        const charSpan = document.createElement('span');
        charSpan.innerText = character;
        quoteDisplayElement.appendChild(charSpan);
    });
    quoteInputElement.value = '';
    speedDisplayElement.hidden = true;
    resetTimer();
    resetProgressBar();
}

function startTimer() {
    timerElement.innerText = 0;
    startTime = new Date();
    timerInterval = setInterval(() => {
        timerElement.innerText = getTimerTime();
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timerElement.innerText = '0';
    timerStarted = false;
}

function getTimerTime() {
    return Math.floor((new Date() - startTime) / 1000);
}

function resetProgressBar() {
    progressBar.style.width = '0%';
}

function displaySpeed() {
    const timeTaken = getTimerTime();
    const words = quoteDisplayElement.innerText.split(' ').length;
    const speed = timeTaken > 0 ? Math.round((words / timeTaken) * 60) : 0;
    wpmElement.innerText = speed;
    speedDisplayElement.hidden = false;
}

quoteInputElement.addEventListener('input', () => {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    const quoteSpans = quoteDisplayElement.querySelectorAll('span');
    const inputCharacters = quoteInputElement.value.split('');
    let correct = true;

    quoteSpans.forEach((charSpan, index) => {
        const character = inputCharacters[index];
        if (character == null) {
            charSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (character === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            correct = false;
        }
    });

    const progress = (inputCharacters.length / quoteSpans.length) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (correct && inputCharacters.length === quoteSpans.length) {
        clearInterval(timerInterval);
        displaySpeed();
        triggerConfetti();
    }
});

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

restartButton.addEventListener('click', () => {
    quoteInputElement.value = '';
    quoteDisplayElement.querySelectorAll('span').forEach(span => {
        span.classList.remove('correct', 'incorrect');
    });
    resetTimer();
    resetProgressBar();
    speedDisplayElement.hidden = true;
});

newQuoteButton.addEventListener('click', () => {
    renderNewQuote();
});

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if(body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

if(localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
}

const cutenessToggle = document.getElementById('cutenessToggle');

cutenessToggle.addEventListener('click', () => {
    body.classList.toggle('cute-mode');
    if (body.classList.contains('cute-mode')) {
        cutenessToggle.textContent = '🎓';
        localStorage.setItem('cuteMode', 'enabled');
    } else {
        cutenessToggle.textContent = '🎀';
        localStorage.setItem('cuteMode', 'disabled');
    }
});

if (localStorage.getItem('cuteMode') === 'enabled') {
    body.classList.add('cute-mode');
    cutenessToggle.textContent = '🎓';
}

window.addEventListener('load', () => {
    renderNewQuote();
});

const speedDisplay = document.getElementById('speedDisplay');
const wpmDisplay = document.getElementById('wpm');

function showSpeed(wpm) {
    if (wpm > 0) {
        wpmDisplay.textContent = wpm;
        speedDisplay.hidden = false;
    } else {
        speedDisplay.hidden = true;
    }
    if(body.classList.contains('cute-mode')) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
showSpeed(0);