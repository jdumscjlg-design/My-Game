let timelineCards = [{ year: 2000, guess: 2000 }]; // Startkarte
let currentTargetIndex = null;

const drawCardBtn = document.getElementById('draw-card-btn');
const newCard = document.getElementById('new-card');
const guessInput = document.getElementById('guess-input');
const timelineDiv = document.getElementById('timeline');
const cardCountSpan = document.getElementById('card-count');

const modalOverlay = document.getElementById('modal-overlay');
const actualYearInput = document.getElementById('actual-year-input');
const confirmYearBtn = document.getElementById('confirm-year-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

updateUI();

// 1. Neue Karte ziehen
drawCardBtn.addEventListener('click', () => {
    guessInput.value = '';
    newCard.classList.remove('hidden');
    drawCardBtn.classList.add('hidden');
    updateUI(); // Klick-Lücken aktivieren
});

// 2. Zeitstrahl und Lücken rendern
function updateUI() {
    timelineDiv.innerHTML = '';
    cardCountSpan.innerText = timelineCards.length;

    const isCardDrawn = !newCard.classList.contains('hidden');

    // Lücke VOR der ersten (ältesten) Karte
    createPlaceButton(0, isCardDrawn);

    timelineCards.forEach((card, index) => {
        // Karte im Zeitstrahl rendern
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <span>${card.year}</span>
            <span class="guess-tag">(Tipp: ${card.guess})</span>
        `;
        timelineDiv.appendChild(item);

        // Lücke NACH der Karte
        createPlaceButton(index + 1, isCardDrawn);
    });
}

function createPlaceButton(index, isActive) {
    const btn = document.createElement('button');
    btn.className = `place-btn ${isActive ? 'active' : ''}`;
    btn.innerText = isActive ? '➕ Hier einordnen' : '---';
    btn.disabled = !isActive;

    btn.addEventListener('click', () => {
        const guessVal = guessInput.value;
        if (!guessVal) {
            alert("Bitte gib zuerst dein geratenes Jahr im obigen Feld ein!");
            guessInput.focus();
            return;
        }

        currentTargetIndex = index;
        actualYearInput.value = '';
        modalOverlay.classList.remove('hidden');
        actualYearInput.focus();
    });

    timelineDiv.appendChild(btn);
}

// 3. Echtes Jahr auswerten
confirmYearBtn.addEventListener('click', () => {
    const actualYear = parseInt(actualYearInput.value);
    const guessYear = parseInt(guessInput.value);

    if (isNaN(actualYear)) {
        alert("Bitte gib das echte Jahr ein!");
        return;
    }

    // Nachbarn ermitteln
    const yearLeft = currentTargetIndex > 0 ? timelineCards[currentTargetIndex - 1].year : -Infinity;
    const yearRight = currentTargetIndex < timelineCards.length ? timelineCards[currentTargetIndex].year : Infinity;

    // PRÜFUNG: Inklusive gleicher Jahreszahlen (<= und >=)
    const isCorrect = (actualYear >= yearLeft) && (actualYear <= yearRight);

    if (isCorrect) {
        alert(` Richtig! Die Karte (${actualYear}) gehört an diese Stelle.`);
        timelineCards.splice(currentTargetIndex, 0, { year: actualYear, guess: guessYear });
        
        // Reset für nächste Karte
        newCard.classList.add('hidden');
        drawCardBtn.classList.remove('hidden');
        modalOverlay.classList.add('hidden');
        updateUI();
    } else {
        alert(` Falsch! Das Jahr ${actualYear} passt nicht zwischen ${yearLeft === -Infinity ? 'Anfang' : yearLeft} und ${yearRight === Infinity ? 'Ende' : yearRight}.`);
        modalOverlay.classList.add('hidden');
    }
});

cancelModalBtn.addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
});

// Reset
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Zeitstrahl zurücksetzen?")) {
        const startYear = prompt("Jahr der 1. Startkarte:", "2000");
        timelineCards = [{ year: parseInt(startYear) || 2000, guess: parseInt(startYear) || 2000 }];
        newCard.classList.add('hidden');
        drawCardBtn.classList.remove('hidden');
        updateUI();
    }
});