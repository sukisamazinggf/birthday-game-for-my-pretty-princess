const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const basket = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 50,
  width: 100,
  height: 20,
  speed: 7
};

let hearts = [];
let collected = 0;
let level = 1;
let maxLevels = 3;
let heartsToCollect = 10; // per level

const heartColors = ['#ff0000', '#ffffff', '#0000ff'];
const heartEmojis = ['❤️','🐰','🌼','🍓'];

document.addEventListener('keydown', (e) => {
  if(e.key === 'ArrowLeft' || e.key === 'a') basket.x -= basket.speed;
  if(e.key === 'ArrowRight' || e.key === 'd') basket.x += basket.speed;
  if(basket.x < 0) basket.x = 0;
  if(basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;
});

function spawnHeart() {
  const size = 30;
  const color = heartColors[Math.floor(Math.random()*heartColors.length)];
  const emoji = heartEmojis[Math.floor(Math.random()*heartEmojis.length)];
  const speed = 2 + level*1.5 + Math.random()*1.5;
  hearts.push({x: Math.random()*(canvas.width-size), y: -size, size, color, emoji, speed});
}

function drawBasket() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
  ctx.fillStyle = '#000';
  ctx.fillText('🎁', basket.x + basket.width/2 - 8, basket.y - 10);
}

function drawHearts() {
  ctx.font = '24px Arial';
  hearts.forEach(h => {
    ctx.fillStyle = h.color;
    ctx.fillText(h.emoji, h.x, h.y);
    h.y += h.speed;
  });
}

function checkCollision() {
  hearts.forEach((h, i) => {
    if(h.y + 24 >= basket.y && h.x + 24 >= basket.x && h.x <= basket.x + basket.width) {
      hearts.splice(i,1);
      collected++;
      document.getElementById('message').innerText = "good job princess!";
      setTimeout(() => { document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}` }, 1000);
      if(collected >= heartsToCollect) nextLevel();
    } else if(h.y > canvas.height) {
      hearts.splice(i,1);
    }
  });
}

function nextLevel() {
  if(level < maxLevels) {
    level++;
    collected = 0;
    hearts = [];
    heartsToCollect += 5;
    document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
  } else {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('message').style.display = 'none';
    document.getElementById('finalMessage').style.display = 'block';
  }
}

function drawClouds() {
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  const cloudY = 100;
  for(let i=0;i<5;i++){
    const cloudX = (i*120 + Date.now()/50)%canvas.width;
    ctx.beginPath();
    ctx.arc(cloudX, cloudY + i*20, 30, 0, Math.PI*2);
    ctx.arc(cloudX + 30, cloudY + i*20 + 10, 30, 0, Math.PI*2);
    ctx.arc(cloudX + 60, cloudY + i*20, 30, 0, Math.PI*2);
    ctx.fill();
  }
}

function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawClouds();
  drawBasket();
  drawHearts();
  checkCollision();
  if(Math.random() < 0.02) spawnHeart();
  requestAnimationFrame(gameLoop);
}

document.getElementById('message').innerText = `Level ${level} - Hearts: ${collected}/${heartsToCollect}`;
gameLoop();
