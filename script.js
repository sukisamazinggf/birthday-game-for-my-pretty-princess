let stage = 'start';

const startScreen = document.getElementById('startScreen');
const playBtn = document.getElementById('playBtn');
const gameUI = document.getElementById('gameUI');
const messageDiv = document.getElementById('message');
const canvas = document.getElementById('gameCanvas');
const failScreen = document.getElementById('failScreen');
const retryBtn = document.getElementById('retryBtn');
const endScreen = document.getElementById('endScreen');
const bouquetDiv = document.getElementById('bouquet');
const envelope = document.getElementById('envelope');

const ctx = canvas.getContext('2d');
const basket = { x: canvas.width / 2 - 50, y: canvas.height - 50, width: 100, height: 20 };
let isDragging = false, dragOffsetX = 0;
let hearts = [], collected = 0, level = 1, maxLevels = 3, heartsToCollect = 10;

const heartColors = ['#ff0000', '#ffffff', '#0000ff'];
const heartEmojis = ['❤️','🐰','🌼','🍓'];

playBtn.onclick = () => {
  stage = 'playing';
  startScreen.style.display = 'none';
  gameUI.style.display = '';
  failScreen.style.display = 'none';
  endScreen.style.display = 'none';
  resetGame();
  messageDiv.innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
  requestAnimationFrame(gameLoop);
};
retryBtn.onclick = () => {
  stage = 'playing';
  startScreen.style.display = 'none';
  gameUI.style.display = '';
  failScreen.style.display = 'none';
  endScreen.style.display = 'none';
  resetGame();
  messageDiv.innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
  requestAnimationFrame(gameLoop);
};

canvas.addEventListener('mousedown', function(e) {
  if(stage !== 'playing') return;
  const rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  if(mouseX >= basket.x && mouseX <= basket.x + basket.width) {
    isDragging = true;
    dragOffsetX = mouseX - basket.x;
  }
});
canvas.addEventListener('mouseup', function() { isDragging = false; });
canvas.addEventListener('mouseleave', function() { isDragging = false; });
canvas.addEventListener('mousemove', function(e) {
  if(isDragging && stage === 'playing') {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    basket.x = mouseX - dragOffsetX;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width)
      basket.x = canvas.width - basket.width;
  }
});

function resetGame() {
  basket.x = canvas.width/2 - 50;
  hearts = [];
  collected = 0;
  level = 1;
  heartsToCollect = 10;
}

function getHeartSpeed() {
  return 2 + (level - 1) * 1.3 + Math.random() * 1.5;
}

function spawnHeart() {
  const size = 30;
  const color = heartColors[Math.floor(Math.random() * heartColors.length)];
  const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  const speed = getHeartSpeed();
  hearts.push({ x: Math.random() * (canvas.width - size), y: -size, size, color, emoji, speed });
}

function drawBasket() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawHearts() {
  ctx.font = '28px Arial';
  hearts.forEach(h => {
    ctx.fillStyle = h.color;
    ctx.fillText(h.emoji, h.x, h.y);
    h.y += h.speed;
  });
}

function checkCollision() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    let h = hearts[i];
    if (
      h.y + 24 >= basket.y &&
      h.y <= basket.y + basket.height &&
      h.x + 24 >= basket.x &&
      h.x <= basket.x + basket.width
    ) {
      if (h.emoji === '❤️') {
        collected++;
        messageDiv.innerText = "good job princess!";
        setTimeout(() => {
          messageDiv.innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
        }, 900);
        if (collected >= heartsToCollect) {
          setTimeout(nextLevel, 800);
        }
      } else {
        failGame();
      }
      hearts.splice(i, 1);
    } else if (h.y > canvas.height) {
      hearts.splice(i, 1);
    }
  }
}

function nextLevel() {
  if (stage !== 'playing') return;
  if (level < maxLevels) {
    level++;
    collected = 0;
    hearts = [];
    heartsToCollect += 5;
    messageDiv.innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
  } else {
    winGame();
  }
}

function failGame() {
  stage = 'fail';
  gameUI.style.display = 'none';
  failScreen.style.display = '';
  endScreen.style.display = 'none';
}

function winGame() {
  stage = 'end';
  gameUI.style.display = 'none';
  failScreen.style.display = 'none';
  showBouquetAndLetter();
  endScreen.style.display = '';
}

function showBouquetAndLetter() {
  bouquetDiv.innerHTML = '';
  for(let i=0; i<5; i++) {
    const flower = document.createElement('span');
    flower.className = 'flower daisy';
    flower.innerText = '🌼';
    bouquetDiv.appendChild(flower);
  }
  for(let i=0; i<5; i++) {
    const flower = document.createElement('span');
    flower.className = 'flower rose';
    flower.innerText = '💙';
    bouquetDiv.appendChild(flower);
  }
  envelope.classList.remove('open');
  envelope.onclick = function() {
    envelope.classList.add('open');
  };
}

function drawClouds() {
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#fff';
  const cloudY = 100;
  for (let i = 0; i < 5; i++) {
    const cloudX = (i * 120 + (Date.now() / 50)) % canvas.width;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY + i * 20, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 30, cloudY + i * 20 + 10, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 60, cloudY + i * 20, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// --- Drops more emojis per frame as level increases!
function emojiDropsPerFrame() {
  return level;
}

function gameLoop() {
  if (stage !== 'playing') return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawBasket();
  drawHearts();
  checkCollision();
  for(let i=0; i<emojiDropsPerFrame(); i++) {
    if (Math.random() < 0.022) spawnHeart();
  }
  requestAnimationFrame(gameLoop);
}
