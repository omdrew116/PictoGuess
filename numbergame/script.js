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

// Ensure DOM elements are loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
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

    // Show start screen initially
    if (startScreen) {
        startScreen.style.display = 'flex';
    }

    // Digit selector logic
    let currentDigitCount = 2;
    const MIN_DIGITS = 2;
    const MAX_DIGITS = 6;

    // Null checks to prevent potential errors
    if (scrollLeftBtn && scrollRightBtn && selectedDigitsSpan) {
        scrollLeftBtn.addEventListener('click', function() {
            currentDigitCount = Math.max(MIN_DIGITS, currentDigitCount - 1);
            selectedDigitsSpan.textContent = currentDigitCount;
        });

        scrollRightBtn.addEventListener('click', function() {
            currentDigitCount = Math.min(MAX_DIGITS, currentDigitCount + 1);
            selectedDigitsSpan.textContent = currentDigitCount;
        });
    }

    // Create congratulations overlay
    function createCongratulationsOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'congratulations-overlay';
        overlay.classList.add('start-screen');

        const content = `
            <div class="start-container">
                <h1>SYSTEM BREACH SUCCESSFUL</h1>
                <div class="text-2xl">
                    You cracked the code in <span id="win-attempts" class="text-cyberpunk-secondary"></span> attempts
                </div>
                <button id="continue-btn" class="cyber-button mt-6">
                    CONTINUE
                </button>
            </div>
        `;

        overlay.innerHTML = content;
        document.body.appendChild(overlay);

        // Update attempts
        const winAttemptsEl = document.getElementById('win-attempts');
        if (winAttemptsEl) {
            winAttemptsEl.textContent = gameState.attempts;
        }

        // Continue button
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn && startScreen) {
            continueBtn.addEventListener('click', function() {
                overlay.remove();
                startScreen.style.display = 'flex';
            });
        }
    }

    // Start game event listener
    if (startGameBtn && startScreen) {
        startGameBtn.addEventListener('click', function() {
            gameState.digitCount = currentDigitCount;
            startScreen.style.display = 'none';
            initGame();
        });
    }

    // Initialize game
    function initGame() {
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
        
        if (statusMessage) {
            statusMessage.textContent = 'INITIALIZE SEQUENCE';
        }
        
        if (submitButton) {
            submitButton.disabled = false;
        }
        
        if (guessesList) {
            guessesList.innerHTML = '';
        }
        
        console.log('Hidden number:', gameState.hiddenNumber.join('')); // For testing
    }

    // Generate random number with specified digit count
    function generateHiddenNumber(digitCount) {
        let digits = [];
        while (digits.length < digitCount) {
            const digit = Math.floor(Math.random() * 10);
            // Ensure no repeating digits
            if (!digits.includes(digit)) {
                digits.push(digit);
            }
        }
        return digits;
    }

    // Update guess display
    function updateGuessDisplay() {
        if (!guessContainer) return;

        // Ensure guess digits match the current digit count
        const currentDigits = guessContainer.querySelectorAll('.guess-digit');
        if (currentDigits.length !== gameState.digitCount) {
            guessContainer.innerHTML = ''; // Clear existing digits
            for (let i = 0; i < gameState.digitCount; i++) {
                const digitEl = document.createElement('div');
                digitEl.classList.add('guess-digit');
                digitEl.textContent = gameState.currentGuess[i];
                guessContainer.appendChild(digitEl);
            }
        }

        const updatedGuessDigits = Array.from(guessContainer.querySelectorAll('.guess-digit'));
        updatedGuessDigits.forEach(function(digit, index) {
            digit.textContent = gameState.currentGuess[index];
            digit.classList.toggle('active', index === gameState.currentPosition);
        });
    }

    // Handle number input
    function handleNumberInput(num) {
        if (gameState.gameWon || gameState.currentPosition >= gameState.digitCount) return;
        
        gameState.currentGuess[gameState.currentPosition] = num;
        gameState.currentPosition++;
        updateGuessDisplay();
    }

    // Handle backspace
    function handleBackspace() {
        if (gameState.currentPosition > 0) {
            gameState.currentPosition--;
            gameState.currentGuess[gameState.currentPosition] = '_';
            updateGuessDisplay();
        }
    }

    // Compare guess with hidden number
    function compareNumbers() {
        let correctPositions = 0;
        
        for (let i = 0; i < gameState.digitCount; i++) {
            if (parseInt(gameState.currentGuess[i]) === gameState.hiddenNumber[i]) {
                correctPositions++;
            }
        }
        
        return correctPositions;
    }

    // Add guess to history with animation
    function addGuessToHistory(guess, correctPositions) {
        if (!guessesList) return;

        const guessItem = document.createElement('div');
        guessItem.className = 'guess-item';
        guessItem.innerHTML = `
            <span>Guess: ${guess.join('')}</span>
            <span class="correct">Correct: ${correctPositions}</span>
        `;
        guessesList.insertBefore(guessItem, guessesList.firstChild);
    }

    // Update score display
    function updateScoreDisplay() {
        if (attemptCount) attemptCount.textContent = gameState.attempts;
        if (bestScore) bestScore.textContent = gameState.bestScore;
    }

    // Update progress bar
    function updateProgressBar(correctPositions) {
        if (progressBar) {
            const progress = (correctPositions / gameState.digitCount) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    // Update status message
    function updateStatusMessage(correctPositions) {
        if (!statusMessage) return;

        if (correctPositions === gameState.digitCount) {
            statusMessage.textContent = 'SYSTEM BREACH SUCCESSFUL! 🎉';
        } else if (correctPositions === 0) {
            statusMessage.textContent = 'NO MATCH. RETRY SEQUENCE.';
        } else {
            statusMessage.textContent = `PARTIAL MATCH: ${correctPositions} DIGITS ALIGNED`;
        }
    }

    // Handle game win
    function handleWin() {
        gameState.gameWon = true;
        if (submitButton) submitButton.disabled = true;
        
        // Update best score
        const currentScore = gameState.attempts;
        if (gameState.bestScore === '-' || currentScore < parseInt(gameState.bestScore)) {
            gameState.bestScore = currentScore;
            localStorage.setItem('bestScore', currentScore);
            if (bestScore) bestScore.textContent = currentScore;
        }

        // Trigger congratulations overlay
        createCongratulationsOverlay();
    }

    // Submit guess
    function submitGuess() {
        if (gameState.gameWon) return;
        
        // Validate input
        if (gameState.currentGuess.includes('_')) {
            if (statusMessage) {
                statusMessage.textContent = 'INCOMPLETE SEQUENCE. FILL ALL DIGITS.';
            }
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
    }

    // Event Listeners
    if (numKeys) {
        numKeys.forEach(function(key) {
            key.addEventListener('click', function() {
                handleNumberInput(key.dataset.num);
            });
        });
    }

    if (backspaceKey) {
        backspaceKey.addEventListener('click', handleBackspace);
    }

    if (submitButton) {
        submitButton.addEventListener('click', submitGuess);
    }

    if (newGameButton && startScreen) {
        newGameButton.addEventListener('click', function() {
            // Remove any existing congratulations overlay
            const existingOverlay = document.getElementById('congratulations-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            // Show start screen
            startScreen.style.display = 'flex';
            
            // Reset some UI elements
            if (statusMessage) {
                statusMessage.textContent = 'INITIALIZE SEQUENCE';
            }
            
            if (guessesList) {
                guessesList.innerHTML = '';
            }
            
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
    }

    // Handle keyboard input
    document.addEventListener('keydown', function(e) {
        if (gameState.gameWon) return;
        
        if (e.key >= '0' && e.key <= '9') {
            handleNumberInput(e.key);
        } else if (e.key === 'Backspace') {
            handleBackspace();
        } else if (e.key === 'Enter') {
            submitGuess();
        }
    });
});
