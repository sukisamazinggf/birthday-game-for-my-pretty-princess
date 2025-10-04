// Hide final message initially
document.getElementById('finalMessage').style.display = 'none';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 50,
  width: 100,
  height: 20,
};

let isDragging = false;
let dragOffsetX = 0;

let hearts = [];
let collected = 0;
let level = 1;
let maxLevels = 3;
let heartsToCollect = 10; // per level

const heartColors = ['#ff0000', '#ffffff', '#0000ff'];
const heartEmojis = ['❤️','🐰','🌼','🍓'];

// --- Mouse drag control ---
canvas.addEventListener('mousedown', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseX = e.clientX - rect.left;
  // Only start drag if mouse is on the basket
  if (
    mouseX >= basket.x &&
    mouseX <= basket.x + basket.width
  ) {
    isDragging = true;
    dragOffsetX = mouseX - basket.x;
  }
});
canvas.addEventListener('mouseup', function() {
  isDragging = false;
});
canvas.addEventListener('mouseleave', function() {
  isDragging = false;
});
canvas.addEventListener('mousemove', function(e) {
  if (isDragging) {
    const rect = canvas.getBoundingClientRect();
    let mouseX = e.clientX - rect.left;
    basket.x = mouseX - dragOffsetX;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width)
      basket.x = canvas.width - basket.width;
  }
});

function spawnHeart() {
  const size = 30;
  const color = heartColors[Math.floor(Math.random() * heartColors.length)];
  const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  const speed = 4 + level * 2 + Math.random() * 2; // FASTER!
  hearts.push({ x: Math.random() * (canvas.width - size), y: -size, size, color, emoji, speed });
}

function drawBasket() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
  // NO gift emoji!
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
      // Only ❤️ gives points!
      if (h.emoji === '❤️') {
        collected++;
        document.getElementById('message').innerText = "good job princess!";
        setTimeout(() => {
          document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
        }, 900);
        if (collected >= heartsToCollect) {
          setTimeout(nextLevel, 800);
        }
      }
      hearts.splice(i, 1);
    } else if (h.y > canvas.height) {
      hearts.splice(i, 1);
    }
  }
}

function nextLevel() {
  if (level < maxLevels) {
    level++;
    collected = 0;
    hearts = [];
    heartsToCollect += 5;
    document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
  } else {
    canvas.style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('finalMessage').style.display = 'block';
  }
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

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawClouds();
  drawBasket();
  drawHearts();
  checkCollision();
  if (Math.random() < 0.025) spawnHeart();
  requestAnimationFrame(gameLoop);
}

document.getElementById('message').style.display = 'block';
document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;

gameLoop();
