let timelineCards = [{ year: 2000, guess: 2000 }]; // Startkarte
let currentTargetIndex = null;

const guessInput = document.getElementById('guess-input');
const timelineDiv = document.getElementById('timeline');
const cardCountSpan = document.getElementById('card-count');

const modalOverlay = document.getElementById('modal-overlay');
const actualYearInput = document.getElementById('actual-year-input');
const confirmYearBtn = document.getElementById('confirm-year-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');

// Initiales Rendern
updateUI();

// Zeitstrahl und Lücken rendern
function updateUI() {
    timelineDiv.innerHTML = '';
    cardCountSpan.innerText = timelineCards.length;

    // Lücke VOR der ersten (ältesten) Karte
    createPlaceButton(0);

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
        createPlaceButton(index + 1);
    });
}

function createPlaceButton(index) {
    const btn = document.createElement('button');
    btn.type = 'button'; // Verhindert Formular-Submits
    btn.className = 'place-btn';
    btn.innerText = '➕ Hier einordnen';

    const handlePlacement = (e) => {
        e.preventDefault();
        
        // Tastatur einklappen, um Touch-Blockaden zu verhindern
        if (document.activeElement) {
            document.activeElement.blur();
        }

        const rawVal = guessInput.value.trim();
        const guessVal = parseInt(rawVal, 10);

        // Prüfen, ob eine gültige Zahl eingegeben wurde
        if (isNaN(guessVal) || rawVal === '') {
            alert("Bitte gib zuerst oben dein geschätztes Jahr ein!");
            guessInput.focus();
            guessInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        currentTargetIndex = index;
        actualYearInput.value = '';
        modalOverlay.classList.remove('hidden');
        
        setTimeout(() => {
            actualYearInput.focus();
        }, 100);
    };

    btn.addEventListener('click', handlePlacement);

    timelineDiv.appendChild(btn);
}

// Echtes Jahr auswerten
confirmYearBtn.addEventListener('click', () => {
    const actualYear = parseInt(actualYearInput.value, 10);
    const guessYear = parseInt(guessInput.value, 10);

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
        alert(`🎉 Richtig! Die Karte (${actualYear}) gehört an diese Stelle.`);
        timelineCards.splice(currentTargetIndex, 0, { year: actualYear, guess: guessYear });
        
        // Input leeren für die nächste Karte
        guessInput.value = '';
        modalOverlay.classList.add('hidden');
        updateUI();
    } else {
        alert(`❌ Falsch! Das Jahr ${actualYear} passt nicht zwischen ${yearLeft === -Infinity ? 'Anfang' : yearLeft} und ${yearRight === Infinity ? 'Ende' : yearRight}.`);
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
        timelineCards = [{ year: parseInt(startYear, 10) || 2000, guess: parseInt(startYear, 10) || 2000 }];
        guessInput.value = '';
        updateUI();
    }
});