const imageDir = 'images/';
let images = [];
let shownImages = new Set();
let score = 0;

const imageElement = document.getElementById('image');
const guessElement = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const scoreElement = document.getElementById('score');

function loadImages() {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', imageDir);
    xhr.onload = () => {
      if (xhr.status === 200) {
        const files = xhr.responseText.split('\n').filter(line => line.endsWith('.jpg') || line.endsWith('.jpeg'));
        images = files.map(file => file.slice(0, -4).toLowerCase());
        resolve();
      } else {
        console.error('Error loading images:', xhr.status);
        resolve(); // Resolve even if there's an error to prevent blocking
      }
    };
    xhr.send();
  });
}

function loadNextImage() {
  if (images.length === shownImages.size) {
    alert('Game Over! Your final score is: ' + score);
    return;
  }
  let nextImage;
  do {
    nextImage = images[Math.floor(Math.random() * images.length)];
  } while (shownImages.has(nextImage));
  shownImages.add(nextImage);
  imageElement.src = imageDir + nextImage + '.jpg';
  guessElement.value = '';
}

function checkAnswer() {
  const guess = guessElement.value.toLowerCase();
  const answer = shownImages.values().next().value;
  if (guess === answer) {
    score++;
    scoreElement.textContent = 'Score: ' + score;
    loadNextImage();
  } else {
    alert('Incorrect guess. Try again!');
  }
}

submitButton.addEventListener('click', checkAnswer);

loadImages().then(loadNextImage);
