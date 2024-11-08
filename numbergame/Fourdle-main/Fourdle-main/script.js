// Theme management
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const getCurrentTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return prefersDarkScheme.matches ? 'dark' : 'light';
};

const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    // Update theme-color meta tag for PWA
    const themeColor = theme === 'dark' ? '#121212' : '#4CAF50';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
};

// Initialize theme
setTheme(getCurrentTheme());

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// Game state
let gameState = {
    hiddenNumber: [],
    currentGuess: ['_', '_', '_', '_'],
    currentPosition: 0,
    attempts: 0,
    bestScore: localStorage.getItem('bestScore') || '-',
    gameWon: false
};

// DOM Elements
const guessDigits = Array.from(document.querySelectorAll('.guess-digit'));
const numKeys = document.querySelectorAll('.num-key');
const backspaceKey = document.querySelector('.backspace-key');
const submitButton = document.getElementById('submit');
const newGameButton = document.getElementById('new-game');
const guessesList = document.getElementById('guesses-list');
const attemptCount = document.getElementById('attempt-count');
const bestScore = document.getElementById('best-score');
const statusMessage = document.getElementById('status-message');
const progressBar = document.getElementById('progress');

// Initialize game
const initGame = () => {
    gameState.hiddenNumber = generateHiddenNumber();
    gameState.currentGuess = ['_', '_', '_', '_'];
    gameState.currentPosition = 0;
    gameState.attempts = 0;
    gameState.gameWon = false;
    
    updateGuessDisplay();
    updateScoreDisplay();
    updateProgressBar(0);
    statusMessage.textContent = 'Make your first guess!';
    submitButton.classList.add('pulse');
    submitButton.disabled = false;
    guessesList.innerHTML = '';
    console.log('Hidden number:', gameState.hiddenNumber.join('')); // For testing
};

// Generate random 4-digit number
const generateHiddenNumber = () => {
    let digits = [];
    while (digits.length < 4) {
        const digit = Math.floor(Math.random() * 10);
        digits.push(digit);
    }
    return digits;
};

// Update guess display
const updateGuessDisplay = () => {
    guessDigits.forEach((digit, index) => {
        digit.textContent = gameState.currentGuess[index];
        digit.classList.toggle('active', index === gameState.currentPosition);
    });
};

// Handle number input
const handleNumberInput = (num) => {
    if (gameState.gameWon || gameState.currentPosition >= 4) return;
    
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
    
    for (let i = 0; i < 4; i++) {
        if (parseInt(gameState.currentGuess[i]) === gameState.hiddenNumber[i]) {
            correctPositions++;
        }
    }
    
    return correctPositions;
};

// Add guess to history with animation
const addGuessToHistory = (guess, correctPositions) => {
    const guessItem = document.createElement('div');
    guessItem.className = 'guess-item';
    guessItem.innerHTML = `
        <span>Guess: ${guess.join('')}</span>
        <span class="correct">Correct positions: ${correctPositions}</span>
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
    const progress = (correctPositions / 4) * 100;
    progressBar.style.width = `${progress}%`;
};

// Update status message
const updateStatusMessage = (correctPositions) => {
    if (correctPositions === 4) {
        statusMessage.textContent = '🎉 Congratulations! You won! 🎉';
    } else if (correctPositions === 0) {
        statusMessage.textContent = 'No correct positions. Try again!';
    } else {
        statusMessage.textContent = `${correctPositions} correct! Keep going!`;
    }
};

// Handle game win
const handleWin = () => {
    gameState.gameWon = true;
    submitButton.disabled = true;
    submitButton.classList.remove('pulse');
    
    // Update best score
    const currentScore = gameState.attempts;
    if (gameState.bestScore === '-' || currentScore < parseInt(gameState.bestScore)) {
        gameState.bestScore = currentScore;
        localStorage.setItem('bestScore', currentScore);
        bestScore.textContent = currentScore;
    }
};

// Submit guess
const submitGuess = () => {
    if (gameState.gameWon) return;
    
    // Validate input
    if (gameState.currentGuess.includes('_')) {
        statusMessage.textContent = 'Please fill in all digits!';
        return;
    }

    gameState.attempts++;
    updateScoreDisplay();

    const correctPositions = compareNumbers();
    addGuessToHistory([...gameState.currentGuess], correctPositions);
    updateProgressBar(correctPositions);
    updateStatusMessage(correctPositions);

    // Check if won
    if (correctPositions === 4) {
        handleWin();
    } else {
        // Reset for next guess
        gameState.currentGuess = ['_', '_', '_', '_'];
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
newGameButton.addEventListener('click', initGame);

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

// Initialize game on load
initGame();
