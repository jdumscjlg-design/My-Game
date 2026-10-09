// Der aktuelle Zeitstrahl des Spielers (Start mit einer zufälligen Referenzkarte)
let timelineYears = [2000]; 

const yearInput = document.getElementById('year-input');
const positionSelect = document.getElementById('position-select');
const addCardBtn = document.getElementById('add-card-btn');
const feedbackMsg = document.getElementById('feedback-msg');
const timelineDiv = document.getElementById('timeline');
const cardCountSpan = document.getElementById('card-count');

// Beim Laden starten
updateUI();

function updateUI() {
    // 1. Zeitstrahl rendern
    timelineDiv.innerHTML = '';
    timelineYears.forEach((yr, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `<span>Karte ${index + 1}</span> <span>${yr}</span>`;
        timelineDiv.appendChild(item);
    });

    cardCountSpan.innerText = timelineYears.length;

    // 2. Auswahlmöglichkeiten für Positionen im Dropdown befüllen
    positionSelect.innerHTML = '';

    // Position VOR der ersten Karte
    let optStart = document.createElement('option');
    optStart.value = 0;
    optStart.innerText = `Vor der 1. Karte (vor ${timelineYears[0]})`;
    positionSelect.appendChild(optStart);

    // Positionen ZWISCHEN den Karten
    for (let i = 0; i < timelineYears.length - 1; i++) {
        let opt = document.createElement('option');
        opt.value = i + 1;
        opt.innerText = `Zwischen Karte ${i + 1} (${timelineYears[i]}) und Karte ${i + 2} (${timelineYears[i + 1]})`;
        positionSelect.appendChild(opt);
    }

    // Position NACH der letzten Karte
    let optEnd = document.createElement('option');
    optEnd.value = timelineYears.length;
    optEnd.innerText = `Nach der letzten Karte (nach ${timelineYears[timelineYears.length - 1]})`;
    positionSelect.appendChild(optEnd);
}

// Prüf- und Einordnungslogik
addCardBtn.addEventListener('click', () => {
    const enteredYear = parseInt(yearInput.value);
    const insertIndex = parseInt(positionSelect.value);

    if (isNaN(enteredYear)) {
        showFeedback("Bitte gib ein gültiges Erscheinungsjahr ein!", "error");
        return;
    }

    // Nachbar-Jahre bestimmen (falls vorhanden)
    const yearLeft = insertIndex > 0 ? timelineYears[insertIndex - 1] : -Infinity;
    const yearRight = insertIndex < timelineYears.length ? timelineYears[insertIndex] : Infinity;

    // REGEL: Bei gleicher Jahreszahl (<= oder >=) gilt der Zug trotzdem als KORREKT!
    const isCorrect = (enteredYear >= yearLeft) && (enteredYear <= yearRight);

    if (isCorrect) {
        // Karte im Array an der gewählten Stelle einfügen
        timelineYears.splice(insertIndex, 0, enteredYear);
        showFeedback(`Richtig! Die Karte (${enteredYear}) wurde eingeordnet.`, "success");
        yearInput.value = '';
        updateUI();
    } else {
        showFeedback(`Falsch! ${enteredYear} passt nicht an diese Stelle.`, "error");
    }
});

function showFeedback(text, type) {
    feedbackMsg.innerText = text;
    feedbackMsg.className = `feedback ${type}`;
    feedbackMsg.classList.remove('hidden');
}

// Reset-Button
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Möchtest du den Zeitstrahl zurücksetzen?")) {
        const startYear = prompt("Gib das Jahr für die 1. Startkarte ein:", "2000");
        timelineYears = [parseInt(startYear) || 2000];
        yearInput.value = '';
        feedbackMsg.classList.add('hidden');
        updateUI();
    }
});