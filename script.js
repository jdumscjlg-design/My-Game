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

updateUI();

// 1. Neue Karte ziehen
drawCardBtn.addEventListener('click', () => {
    guessInput.value = '';
    newCard.classList.remove('hidden');
    drawCardBtn.classList.add('hidden');
});

// 2. Drag & Drop Event-Handler für die Karte
newCard.addEventListener('dragstart', (e) => {
    const guessVal = guessInput.value;
    if (!guessVal) {
        e.preventDefault();
        alert("Bitte gib zuerst dein geratenes Jahr auf der Karte ein!");
        return;
    }
    e.dataTransfer.setData('text/plain', guessVal);
});

// 3. UI neu aufbauen (Zeitstrahl + Drop-Zones)
function updateUI() {
    timelineDiv.innerHTML = '';
    cardCountSpan.innerText = timelineCards.length;

    // Drop-Zone VOR der ersten Karte
    createDropZone(0);

    timelineCards.forEach((card, index) => {
        // Karte rendern
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <span>${card.year}</span>
            <span class="guess-tag">(Gefallener Tipp: ${card.guess})</span>
        `;
        timelineDiv.appendChild(item);

        // Drop-Zone ZWISCHEN/NACH den Karten
        createDropZone(index + 1);
    });
}

function createDropZone(index) {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.innerText = ' Hier ablegen';

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        currentTargetIndex = index;
        // Öffne Modal für die Auflösung
        actualYearInput.value = '';
        modalOverlay.classList.remove('hidden');
    });

    timelineDiv.appendChild(zone);
}

// 4. Echtes Jahr auflösen & Regel prüfen
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

    // KORREKTHEITS-PRÜFUNG: Inklusive gleicher Jahreszahlen (<= und >=)
    const isCorrect = (actualYear >= yearLeft) && (actualYear <= yearRight);

    if (isCorrect) {
        alert(` Richtig! Die Karte (${actualYear}) passt perfekt an diese Stelle.`);
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