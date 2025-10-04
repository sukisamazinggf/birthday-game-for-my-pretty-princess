// --- CONFIG ---
const DIFFICULTIES = {
  easy:   { popupTime: 1100, reload: 6,   spawnDelay: 550 },
  medium: { popupTime: 700,  reload: 5,   spawnDelay: 350 },
  hard:   { popupTime: 450,  reload: 3,   spawnDelay: 200 }
};
const WIN_HITS = 30;
const ROUND_TIME = 60; // seconds

let state = "menu"; // menu, playing, fail, win, egg
let difficulty = "easy";

// --- DOM ---
const mainMenu = document.getElementById('mainMenu');
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

// --- GAME VARS ---
let timeLeft = ROUND_TIME;
let score = 0;
let shots = 0;
let reloads = 0;
let ammo = 6;
let popupTime = 1100;
let reloadSize = 6;
let spawnDelay = 550;
let roundTimer, popupTimer, spawnTimer;
let target = null;
let aiming = false;
let mouse = { x: 0, y: 0 };
let perfect = true; // for Easter egg

// --- Main Menu handlers ---
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.onclick = () => startGame(btn.dataset.mode);
});
function showMenu() {
  state = "menu";
  mainMenu.style.display = "";
  gameUI.style.display = "none";
  failScreen.style.display = "none";
  winScreen.style.display = "none";
  easterEgg.style.display = "none";
  document.body.style.cursor = "";
}
function startGame(mode) {
  state = "playing";
  difficulty = mode;
  mainMenu.style.display = "none";
  failScreen.style.display = "none";
  winScreen.style.display = "none";
  easterEgg.style.display = "none";
  gameUI.style.display = "";
  document.body.style.cursor = "none";
  // Set difficulty:
  popupTime = DIFFICULTIES[mode].popupTime;
  reloadSize = DIFFICULTIES[mode].reload;
  spawnDelay = DIFFICULTIES[mode].spawnDelay;
  // Reset
  score = 0;
  shots = 0;
  reloads = 0;
  ammo = reloadSize;
  timeLeft = ROUND_TIME;
  target = null;
  perfect = true;
  updateHUD();
  placeCrosshair(canvas.width/2,canvas.height/2);
  nextTarget();
  roundTimer = setInterval(() => {
    timeLeft--;
    updateHUD();
    if (timeLeft <= 0) failGame("Time's up! Try again?");
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
}
function winGame() {
  clearTimers();
  state = "win";
  winScreen.style.display = "";
  document.body.style.cursor = "";
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
menuBtn.onclick = menuBtn2.onclick = eggMenuBtn.onclick = showMenu;
retryBtn.onclick = againBtn.onclick = () => startGame(difficulty);
backBtn.onclick = () => showMenu();

// --- Shooting ---
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  placeCrosshair(mouse.x, mouse.y);
});
canvas.addEventListener('mouseleave', () => crosshair.style.display="none");
canvas.addEventListener('mouseenter', () => crosshair.style.display="");
canvas.addEventListener('mousedown', shoot);
document.addEventListener('keydown', e => {
  if (e.key === "r" || e.key === "R") doReload();
});
reloadBtn.onclick = doReload;
function placeCrosshair(x, y) {
  crosshair.style.left = (canvas.offsetLeft + x - 22) + "px";
  crosshair.style.top = (canvas.offsetTop + y - 22) + "px";
}
function shoot(e) {
  if (state !== "playing" || !target || ammo <= 0) return;
  shots++;
  ammo--;
  // check hit (circle hitbox)
  const dx = mouse.x - target.x;
  const dy = mouse.y - target.y;
  if (dx*dx + dy*dy < target.r*target.r) {
    // hit
    score++;
    updateHUD();
    popupTarget(false); // remove target
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

// --- Targets ---
function nextTarget() {
  if (state !== "playing") return;
  // random spot, not too close to edges
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
    // spawn next after delay
    spawnTimer = setTimeout(nextTarget, spawnDelay);
  }
}

// --- Drawing ---
function animate() {
  if (state !== "playing") return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // clouds
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
  // target
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

// --- Easter Egg ---
function showEasterEgg() {
  state = "egg";
  winScreen.style.display = "none";
  gameUI.style.display = "none";
  mainMenu.style.display = "none";
  failScreen.style.display = "none";
  easterEgg.style.display = "";
  // Bouquet
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

// --- On load: show menu ---
showMenu();
