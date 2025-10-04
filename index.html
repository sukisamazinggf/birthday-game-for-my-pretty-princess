const DIFFICULTIES = {
  easy:   { popupTime: 1300, reload: 6,   spawnDelay: 700 },
  medium: { popupTime: 900,  reload: 5,   spawnDelay: 400 },
  hard:   { popupTime: 600,  reload: 3,   spawnDelay: 220 }
};
const WIN_HITS = 30;
const ROUND_TIME = 60; // seconds

let state = "menu";
let difficulty = "easy";

const mainMenu = document.getElementById('mainMenu');
const countdownScreen = document.getElementById('countdownScreen');
const countdownMsg = document.getElementById('countdownMsg');
const gameUI = document.getElementById('gameUI');
const failScreen = document.getElementById('failScreen');
const winScreen = document.getElementById('winScreen');
const easterEgg = document.getElementById('easterEgg');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const crosshair = document.getElementById('crosshair');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const ammoSpan = document.getElementById('ammo');
const reloadBtn = document.getElementById('reloadBtn');
const backBtn = document.getElementById('backBtn');
const retryBtn = document.getElementById('retryBtn');
const menuBtn = document.getElementById('menuBtn');
const againBtn = document.getElementById('againBtn');
const menuBtn2 = document.getElementById('menuBtn2');
const bouquetDiv = document.getElementById('bouquet');
const envelope = document.getElementById('envelope');
const eggMenuBtn = document.getElementById('eggMenuBtn');
const popSound = document.getElementById('popSound');
const secretHeart = document.getElementById('secretHeart');

let timeLeft = ROUND_TIME;
let score = 0;
let shots = 0;
let reloads = 0;
let ammo = 6;
let popupTime = 1300;
let reloadSize = 6;
let spawnDelay = 700;
let roundTimer, popupTimer, spawnTimer;
let target = null;
let aiming = false;
let mouse = { x: 300, y: 400 };
let perfect = true; // for Easter egg

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.onclick = () => beginCountdown(btn.dataset.mode);
});
function showMenu() {
  state = "menu";
  mainMenu.style.display = "";
  gameUI.style.display = "none";
  failScreen.style.display = "none";
  winScreen.style.display = "none";
  easterEgg.style.display = "none";
  countdownScreen.style.display = "none";
  document.body.style.cursor = "";
  crosshair.style.display = "none";
}
menuBtn.onclick = menuBtn2.onclick = eggMenuBtn.onclick = showMenu;
retryBtn.onclick = againBtn.onclick = () => beginCountdown(difficulty);
backBtn.onclick = () => showMenu();

function beginCountdown(mode) {
  difficulty = mode;
  mainMenu.style.display = "none";
  gameUI.style.display = "none";
  failScreen.style.display = "none";
  winScreen.style.display = "none";
  easterEgg.style.display = "none";
  countdownScreen.style.display = "";
  crosshair.style.display = "none";
  let countArr = ["Get Ready...", "3", "2", "1", "GO!"];
  let idx = 0;
  countdownMsg.textContent = countArr[idx];
  let timer = setInterval(() => {
    idx++;
    if(idx < countArr.length) {
      countdownMsg.textContent = countArr[idx];
    } else {
      clearInterval(timer);
      countdownScreen.style.display = "none";
      setTimeout(() => startGame(mode), 350);
    }
  }, 850);
}

function startGame(mode) {
  state = "playing";
  failScreen.style.display = "none";
  winScreen.style.display = "none";
  easterEgg.style.display = "none";
  gameUI.style.display = "";
  document.body.style.cursor = "none";
  crosshair.style.display = "";
  popupTime = DIFFICULTIES[mode].popupTime;
  reloadSize = DIFFICULTIES[mode].reload;
  spawnDelay = DIFFICULTIES[mode].spawnDelay;
  score = 0;
  shots = 0;
  reloads = 0;
  ammo = reloadSize;
  timeLeft = ROUND_TIME;
  target = null;
  perfect = true;
  updateHUD();
  placeCrosshair(mouse.x,mouse.y);
  nextTarget();
  roundTimer = setInterval(() => {
    timeLeft--;
    updateHUD();
    if (timeLeft <= 0 && state === "playing") failGame("Time's up! Try again?");
  }, 1000);
  animate();
}

function updateHUD() {
  timerSpan.textContent = `Time: ${timeLeft}s`;
  scoreSpan.textContent = `Score: ${score} / ${WIN_HITS}`;
  ammoSpan.textContent = `Ammo: ${ammo}/${reloadSize}`;
}
function failGame(msg="Oops! Try again!") {
  clearTimers();
  state = "fail";
  failScreen.style.display = "";
  failScreen.querySelector("#failMessage").textContent = msg;
  gameUI.style.display = "none";
  document.body.style.cursor = "";
  crosshair.style.display = "none";
}
function winGame() {
  clearTimers();
  state = "win";
  winScreen.style.display = "";
  document.body.style.cursor = "";
  crosshair.style.display = "none";
  gameUI.style.display = "none";
  let msg = `You did it! You hit ${score} hearts in ${ROUND_TIME} seconds!`;
  if (score >= WIN_HITS) msg += "\nYou're amazing! 💖";
  if (perfect && score === WIN_HITS && reloads === 0) {
    msg += "\nPERFECT!! (Secret unlocked)";
    setTimeout(showEasterEgg, 2000);
  }
  winScreen.querySelector("#congratsMsg").textContent = msg;
}
function clearTimers() {
  clearInterval(roundTimer);
  clearTimeout(popupTimer);
  clearTimeout(spawnTimer);
}

function moveCrosshair(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  crosshair.style.transform = `translate(${mouse.x-22}px,${mouse.y-22}px)`;
}
document.addEventListener('mousemove', moveCrosshair);
canvas.addEventListener('mousedown', shoot);
document.addEventListener('keydown', e => {
  if (e.key === "r" || e.key === "R") doReload();
});
reloadBtn.onclick = doReload;
function placeCrosshair(x, y) {
  crosshair.style.transform = `translate(${x-22}px,${y-22}px)`;
}
function shoot(e) {
  if (state !== "playing" || !target || ammo <= 0) return;
  try { popSound.currentTime = 0; popSound.play(); } catch(e){}
  shots++;
  ammo--;
  let rect = canvas.getBoundingClientRect();
  let mx = mouse.x - rect.left;
  let my = mouse.y - rect.top;
  const dx = mx - target.x;
  const dy = my - target.y;
  if (dx*dx + dy*dy < target.r*target.r) {
    score++;
    updateHUD();
    popupTarget(false);
    if (score >= WIN_HITS) winGame();
    else spawnTimer = setTimeout(nextTarget, spawnDelay);
  } else {
    perfect = false;
    failGame("You missed! Try again!");
    return;
  }
  if (ammo <= 0) doReload();
}
function doReload() {
  if (state !== "playing") return;
  ammo = reloadSize;
  reloads++;
  updateHUD();
}

function nextTarget() {
  if (state !== "playing") return;
  let x = 60 + Math.random()*(canvas.width-120);
  let y = 100 + Math.random()*(canvas.height-180);
  target = { x, y, r: 36 };
  popupTimer = setTimeout(() => {
    perfect = false;
    popupTarget(true);
    failGame("Target got away! Try again!");
  }, popupTime);
}
function popupTarget(removeOnly) {
  target = null;
  if (!removeOnly) {
    spawnTimer = setTimeout(nextTarget, spawnDelay);
  }
}

function animate() {
  if (state !== "playing") return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 5; i++) {
    const cloudX = (i * 120 + (Date.now() / 50)) % canvas.width;
    ctx.beginPath();
    ctx.arc(cloudX, 100 + i*20, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 30, 110 + i*20, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 60, 100 + i*20, 30, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  if (target) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.r, 0, 2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#e75480";
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e75480";
    ctx.shadowBlur = 0;
    ctx.fillText("❤️", target.x, target.y+3);
    ctx.restore();
  }
  requestAnimationFrame(animate);
}

// --- Easter Egg Option 2: Click secret heart 5 times ---
let secretClicks = 0;
let secretTimer = null;
secretHeart.onclick = () => {
  secretClicks++;
  if (secretClicks === 5) {
    secretClicks = 0;
    showEasterEgg();
  } else {
    if (secretTimer) clearTimeout(secretTimer);
    secretTimer = setTimeout(()=>secretClicks=0, 1800);
  }
};

function showEasterEgg() {
  state = "egg";
  winScreen.style.display = "none";
  gameUI.style.display = "none";
  mainMenu.style.display = "none";
  failScreen.style.display = "none";
  countdownScreen.style.display = "none";
  crosshair.style.display = "none";
  easterEgg.style.display = "";
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

showMenu();
