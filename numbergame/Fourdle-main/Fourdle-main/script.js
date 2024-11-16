// Game state
let gameState = {
    hiddenNumber: [],
    digitCount: 4,
    currentGuess: [],
    currentPosition: 0,
    attempts: 0,
    bestScore: localStorage.getItem('bestScore') || '-',
    gameWon: false
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const selectedDigitsSpan = document.getElementById('selected-digits');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const startGameBtn = document.getElementById('start-game-btn');
const guessContainer = document.querySelector('.guess-container');
const numKeys = document.querySelectorAll('.num-key');
const backspaceKey = document.querySelector('.backspace-key');
const submitButton = document.getElementById('submit');
const newGameButton = document.getElementById('new-game');
const guessesList = document.getElementById('guesses-list');
const attemptCount = document.getElementById('attempt-count');
const bestScore = document.getElementById('best-score');
const statusMessage = document.getElementById('status-message');
const progressBar = document.getElementById('progress');

// Digit selector logic
let currentDigitCount = 4;
const MIN_DIGITS = 2;
const MAX_DIGITS = 6;

scrollLeftBtn.addEventListener('click', () => {
    currentDigitCount = Math.max(MIN_DIGITS, currentDigitCount - 1);
    selectedDigitsSpan.textContent = currentDigitCount;
    selectedDigitsSpan.classList.add('animate-pulse');
    setTimeout(() => selectedDigitsSpan.classList.remove('animate-pulse'), 500);
});

scrollRightBtn.addEventListener('click', () => {
    currentDigitCount = Math.min(MAX_DIGITS, currentDigitCount + 1);
    selectedDigitsSpan.textContent = currentDigitCount;
    selectedDigitsSpan.classList.add('animate-pulse');
    setTimeout(() => selectedDigitsSpan.classList.remove('animate-pulse'), 500);
});

// Create congratulations overlay
const createCongratulationsOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'congratulations-overlay';
    overlay.classList.add(
        'fixed', 'inset-0', 'z-50', 'flex', 'flex-col', 'items-center', 'justify-center', 
        'bg-black/80', 'backdrop-blur-sm', 'animate-fade-in'
    );

    const content = `
        <div class="text-center space-y-6">
            <div class="congratulations-text text-6xl font-bold text-cyberpunk-secondary 
                        animate-pulse-glow drop-shadow-[0_0_20px_rgba(0,255,209,0.7)]">
                SYSTEM BREACH SUCCESSFUL
            </div>
            <div class="text-2xl text-cyberpunk-text animate-slide-up">
                You cracked the code in <span id="win-attempts" class="text-cyberpunk-secondary"></span> attempts
            </div>
            <button id="continue-btn" class="cyber-button mt-6 text-xl animate-bounce">
                CONTINUE
            </button>
        </div>

        <div class="absolute inset-0 pointer-events-none">
            ${Array(50).fill().map(() => `
                <div class="absolute cyber-glitch" style="
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    width: ${Math.random() * 10}px;
                    height: ${Math.random() * 10}px;
                    background-color: rgba(0, 255, 209, ${Math.random()});
                    animation: cyber-glitch ${Math.random() * 2 + 1}s infinite;
                "></div>
            `).join('')}
        </div>
    `;

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    // Update attempts
    document.getElementById('win-attempts').textContent = gameState.attempts;

    // Continue button
    const continueBtn = document.getElementById('continue-btn');
    continueBtn.addEventListener('click', () => {
        overlay.remove();
        startScreen.classList.remove('hidden');
    });
};

// Start game event listener
startGameBtn.addEventListener('click', () => {
    gameState.digitCount = currentDigitCount;
    startScreen.classList.add('hidden');
    initGame();
});

// Initialize game
const initGame = () => {
    // Reset game state with selected digit count
    gameState.hiddenNumber = generateHiddenNumber(gameState.digitCount);
    gameState.currentGuess = Array(gameState.digitCount).fill('_');
    gameState.currentPosition = 0;
    gameState.attempts = 0;
    gameState.gameWon = false;
    
    // Update UI to match digit count
    updateGuessDisplay();
    updateScoreDisplay();
    updateProgressBar(0);
    statusMessage.textContent = 'INITIALIZE SEQUENCE';
    statusMessage.classList.add('animate-pulse-glow');
    submitButton.disabled = false;
    guessesList.innerHTML = '';
    console.log('Hidden number:', gameState.hiddenNumber.join('')); // For testing
};

// Generate random number with specified digit count
const generateHiddenNumber = (digitCount) => {
    let digits = [];
    while (digits.length < digitCount) {
        const digit = Math.floor(Math.random() * 10);
        // Ensure no repeating digits
        if (!digits.includes(digit)) {
            digits.push(digit);
        }
    }
    return digits;
};

// Update guess display
const updateGuessDisplay = () => {
    // Ensure guess digits match the current digit count
    const currentDigits = guessContainer.querySelectorAll('.guess-digit');
    if (currentDigits.length !== gameState.digitCount) {
        guessContainer.innerHTML = ''; // Clear existing digits
        for (let i = 0; i < gameState.digitCount; i++) {
            const digitEl = document.createElement('div');
            digitEl.classList.add('guess-digit', 'w-12', 'h-12', 'border', 'border-cyberpunk-primary', 'bg-cyberpunk-background/50', 'flex', 'items-center', 'justify-center', 'text-2xl', 'rounded-lg');
            digitEl.textContent = gameState.currentGuess[i];
            guessContainer.appendChild(digitEl);
        }
    }

    const updatedGuessDigits = Array.from(guessContainer.querySelectorAll('.guess-digit'));
    updatedGuessDigits.forEach((digit, index) => {
        digit.textContent = gameState.currentGuess[index];
        digit.classList.toggle('bg-cyberpunk-secondary', index === gameState.currentPosition);
    });
};

// Handle number input
const handleNumberInput = (num) => {
    if (gameState.gameWon || gameState.currentPosition >= gameState.digitCount) return;
    
    gameState.currentGuess[gameState.currentPosition] = num;
    gameState.currentPosition++;
    updateGuessDisplay();
};

// Handle backspace
const handleBackspace = () => {
    if (gameState.currentPosition > 0) {
        gameState.currentPosition--;
        gameState.currentGuess[gameState.currentPosition] = '_';
        updateGuessDisplay();
    }
};

// Compare guess with hidden number
const compareNumbers = () => {
    let correctPositions = 0;
    
    for (let i = 0; i < gameState.digitCount; i++) {
        if (parseInt(gameState.currentGuess[i]) === gameState.hiddenNumber[i]) {
            correctPositions++;
        }
    }
    
    return correctPositions;
};

// Add guess to history with animation
const addGuessToHistory = (guess, correctPositions) => {
    const guessItem = document.createElement('div');
    guessItem.className = 'bg-cyberpunk-background/50 p-2 rounded-lg flex justify-between items-center animate-flicker';
    guessItem.innerHTML = `
        <span class="text-cyberpunk-text">Guess: ${guess.join('')}</span>
        <span class="text-cyberpunk-secondary font-bold">Correct: ${correctPositions}</span>
    `;
    guessesList.insertBefore(guessItem, guessesList.firstChild);
};

// Update score display
const updateScoreDisplay = () => {
    attemptCount.textContent = gameState.attempts;
    bestScore.textContent = gameState.bestScore;
};

// Update progress bar
const updateProgressBar = (correctPositions) => {
    const progress = (correctPositions / gameState.digitCount) * 100;
    progressBar.style.width = `${progress}%`;
};

// Update status message
const updateStatusMessage = (correctPositions) => {
    if (correctPositions === gameState.digitCount) {
        statusMessage.textContent = 'SYSTEM BREACH SUCCESSFUL! 🎉';
        statusMessage.classList.remove('animate-pulse-glow');
        statusMessage.classList.add('text-cyberpunk-secondary', 'animate-pulse');
    } else if (correctPositions === 0) {
        statusMessage.textContent = 'NO MATCH. RETRY SEQUENCE.';
    } else {
        statusMessage.textContent = `PARTIAL MATCH: ${correctPositions} DIGITS ALIGNED`;
    }
};

// Handle game win
const handleWin = () => {
    gameState.gameWon = true;
    submitButton.disabled = true;
    
    // Update best score
    const currentScore = gameState.attempts;
    if (gameState.bestScore === '-' || currentScore < parseInt(gameState.bestScore)) {
        gameState.bestScore = currentScore;
        localStorage.setItem('bestScore', currentScore);
        bestScore.textContent = currentScore;
    }

    // Trigger congratulations overlay
    createCongratulationsOverlay();
};

// Submit guess
const submitGuess = () => {
    if (gameState.gameWon) return;
    
    // Validate input
    if (gameState.currentGuess.includes('_')) {
        statusMessage.textContent = 'INCOMPLETE SEQUENCE. FILL ALL DIGITS.';
        return;
    }

    gameState.attempts++;
    updateScoreDisplay();

    const correctPositions = compareNumbers();
    addGuessToHistory([...gameState.currentGuess], correctPositions);
    updateProgressBar(correctPositions);
    updateStatusMessage(correctPositions);

    // Check if won
    if (correctPositions === gameState.digitCount) {
        handleWin();
    } else {
        // Reset for next guess
        gameState.currentGuess = Array(gameState.digitCount).fill('_');
        gameState.currentPosition = 0;
        updateGuessDisplay();
    }
};

// Event Listeners
numKeys.forEach(key => {
    key.addEventListener('click', () => handleNumberInput(key.dataset.num));
});

backspaceKey.addEventListener('click', handleBackspace);
submitButton.addEventListener('click', submitGuess);
newGameButton.addEventListener('click', () => {
    startScreen.classList.remove('hidden');
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (gameState.gameWon) return;
    
    if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
    } else if (e.key === 'Backspace') {
        handleBackspace();
    } else if (e.key === 'Enter') {
        submitGuess();
    }
});
