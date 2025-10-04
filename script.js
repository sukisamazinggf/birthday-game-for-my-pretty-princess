// ---- CONFIG ----
const TARGET_RADIUS = 42;
const TARGET_POPUP_TIME = 1150; // ms target stays for
const MIN_POPUP = 550;
const MAX_POPUP = 1300;
const GAME_TIME = 60; // seconds
const PERFECT_SCORE = 40;
const POP_ANIM_TIME = 220;

// ---- STATE ----
let running = false;
let timer = 0;
let hits = 0, shots = 0, misses = 0;
let accuracy = 0;
let targets = [];
let currentTarget = null;
let targetTimeout = null;
let popAnim = null;
let cursorX = 0, cursorY = 0;
let pointerLocked = false;
let startTime, timeLeft = GAME_TIME;
let requestFrameId = null;
let ended = false;

// ---- DOM ----
const canvas = document.getElementById('aimCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const uiOverlay = document.getElementById('uiOverlay');
const hud = document.getElementById('hud');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const shotsSpan = document.getElementById('shots');
const accuracySpan = document.getElementById('accuracy');
const endScreen = document.getElementById('endScreen');
const endTitle = document.getElementById('endTitle');
const summary = document.getElementById('summary');
const restartBtn = document.getElementById('restartBtn');
const popSound = document.getElementById('popSound');
// easter egg
const easterEggBlock = document.getElementById('easterEgg');
const bouquetDiv = document.getElementById('bouquet');
const envelope = document.getElementById('envelope');

// ---- UTILS ----
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ---- GAME ----
function showStart() {
  startScreen.style.display = "";
  endScreen.style.display = "none";
  uiOverlay.style.display = "none";
  canvas.style.display = "none";
  ended = false;
  document.exitPointerLock && document.exitPointerLock();
}
function startGame() {
  running = true;
  hits = 0; shots = 0; misses = 0;
  accuracy = 0;
  timeLeft = GAME_TIME;
  startScreen.style.display = "none";
  endScreen.style.display = "none";
  uiOverlay.style.display = "";
  canvas.style.display = "";
  cursorX = window.innerWidth/2;
  cursorY = window.innerHeight/2;
  document.body.style.cursor = "none";
  // pointer lock for FPS feel
  canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  if (canvas.requestPointerLock) canvas.requestPointerLock();
  startTime = Date.now();
  spawnTarget();
  updateHUD();
  gameLoop();
  setTimeout(timerTick, 1000);
}
function timerTick() {
  if (!running) return;
  timeLeft--;
  updateHUD();
  if (timeLeft <= 0) endGame();
  else setTimeout(timerTick, 1000);
}
function endGame() {
  running = false;
  ended = true;
  clearTimeout(targetTimeout);
  cancelAnimationFrame(requestFrameId);
  document.exitPointerLock && document.exitPointerLock();
  showEndScreen();
}
function updateHUD() {
  timerSpan.textContent = `Time: ${timeLeft}s`;
  scoreSpan.textContent = `Hits: ${hits}`;
  shotsSpan.textContent = `Shots: ${shots}`;
  accuracy = shots > 0 ? Math.round((hits/shots)*100) : 100;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
}
function spawnTarget() {
  if (!running) return;
  // Place not too close to edge
  let pad = TARGET_RADIUS + 12;
  let x = pad + Math.random()*(canvas.width-2*pad);
  let y = pad + Math.random()*(canvas.height-2*pad);
  currentTarget = {x, y, r: TARGET_RADIUS, popping: false};
  let popup = MIN_POPUP + Math.random()*(MAX_POPUP-MIN_POPUP);
  targetTimeout = setTimeout(() => {
    if (!currentTarget || currentTarget.popping) return;
    misses++;
    popTarget(false);
    // Don't spawn new target if time is up
    if (running && timeLeft > 0) setTimeout(spawnTarget, 240);
  }, popup);
}
function popTarget(hit) {
  if (!currentTarget) return;
  currentTarget.popping = true;
  if (hit) {
    popSound.currentTime = 0; popSound.play();
    hits++;
  } else {
    misses++;
  }
  shots++;
  updateHUD();
  let popX = currentTarget.x, popY = currentTarget.y;
  popAnim = {x: popX, y: popY, r: TARGET_RADIUS, t: Date.now(), hit};
  currentTarget = null;
  clearTimeout(targetTimeout);
  if (running && timeLeft > 0) setTimeout(spawnTarget, 220);
}
function handleShot() {
  if (!running || !currentTarget) return;
  let dx = cursorX - currentTarget.x;
  let dy = cursorY - currentTarget.y;
  if (dx*dx + dy*dy < currentTarget.r*currentTarget.r) {
    popTarget(true);
  } else {
    popTarget(false);
  }
}
function gameLoop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // clouds
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 8; i++) {
    const cloudX = (i * 220 + (Date.now() / 50)) % canvas.width;
    ctx.beginPath();
    ctx.arc(cloudX, 120 + i*20, 60, 0, Math.PI * 2);
    ctx.arc(cloudX + 50, 120 + i*20 + 12, 60, 0, Math.PI * 2);
    ctx.arc(cloudX + 100, 120 + i*20, 60, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // target
  if (currentTarget && !currentTarget.popping) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(currentTarget.x, currentTarget.y, currentTarget.r, 0, 2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#e75480";
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e75480";
    ctx.shadowBlur = 0;
    ctx.fillText("❤️", currentTarget.x, currentTarget.y+5);
    ctx.restore();
  }

  // pop anim
  if (popAnim) {
    let dt = Date.now()-popAnim.t;
    if (dt < POP_ANIM_TIME) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(popAnim.x, popAnim.y, popAnim.r+dt/5, 0, 2*Math.PI);
      ctx.globalAlpha = 1-dt/POP_ANIM_TIME;
      ctx.fillStyle = popAnim.hit ? "#ffb3c6" : "#b8b8b8";
      ctx.fill();
      ctx.restore();
    } else popAnim = null;
  }

  // crosshair (centered)
  ctx.save();
  ctx.font = "40px Arial";
  ctx.globalAlpha = 0.82;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeStyle = "#e75480";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "#e75480";
  ctx.shadowBlur = 7;
  ctx.strokeText("+", canvas.width/2, canvas.height/2+2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#e75480";
  ctx.fillText("+", canvas.width/2, canvas.height/2+2);
  ctx.restore();

  requestFrameId = requestAnimationFrame(gameLoop);
}

// ---- INPUT ----
canvas.addEventListener("click", () => {
  if (!pointerLocked) {
    canvas.requestPointerLock();
    return;
  }
  // crosshair is always at center in pointer lock
  cursorX = canvas.width/2;
  cursorY = canvas.height/2;
  handleShot();
});

document.addEventListener("pointerlockchange", () => {
  pointerLocked = (document.pointerLockElement === canvas);
  if (!pointerLocked) document.body.style.cursor = "";
});
document.addEventListener("mousemove", e => {
  if (pointerLocked) {
    // FPS mouse
    cursorX += e.movementX;
    cursorY += e.movementY;
    cursorX = Math.max(0, Math.min(canvas.width, cursorX));
    cursorY = Math.max(0, Math.min(canvas.height, cursorY));
  }
});

// ---- UI ----
startBtn.onclick = startGame;
restartBtn.onclick = () => {
  showStart();
  setTimeout(()=>window.location.reload(), 100);
};
envelope.onclick = function() {
  envelope.classList.add('open');
};

// Easter Egg: perfect score or click "+" crosshair in end screen 6 times
let eggClicks = 0;
endScreen.addEventListener('click', function(e){
  const rect = canvas.getBoundingClientRect();
  let cx = window.innerWidth/2, cy = window.innerHeight/2;
  let mx = e.clientX, my = e.clientY;
  if (Math.abs(mx-cx)<32 && Math.abs(my-cy)<32) {
    eggClicks++;
    if (eggClicks>=6) showEasterEgg();
  }
});

function showEndScreen() {
  uiOverlay.style.display = "none";
  canvas.style.display = "none";
  endScreen.style.display = "";
  let acc = shots>0 ? Math.round((hits/shots)*100) : 100;
  let msg = `You hit <b>${hits}</b> hearts in ${GAME_TIME} seconds.<br>Accuracy: <b>${acc}%</b>`;
  summary.innerHTML = msg;
  if (hits >= PERFECT_SCORE) {
    endTitle.innerText = "PERFECT!";
    showEasterEgg();
  } else if (hits > 20) {
    endTitle.innerText = "Great job!";
    easterEggBlock.style.display = "none";
  } else {
    endTitle.innerText = "Keep practicing!";
    easterEggBlock.style.display = "none";
  }
}
function showEasterEgg() {
  if (easterEggBlock.style.display !== "block") {
    easterEggBlock.style.display = "block";
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
  }
}

showStart();
