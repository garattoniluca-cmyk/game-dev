let gameMap;
let player;
let renderer;
let keys = {};
let touchControls = {
  up: false,
  down: false,
  left: false,
  right: false,
  shoot: false
};

async function init() {
  const canvas = document.getElementById('gameCanvas');
  renderer = new Renderer(canvas);
  
  gameMap = new GameMap();
  await gameMap.load('data/level.json');
  
  player = new Player(5, 5, 0);
  
  // Keyboard
  window.addEventListener('keydown', (e) => keys[e.key] = true);
  window.addEventListener('keyup', (e) => keys[e.key] = false);
  
  // Touch controls setup
  setupTouchControls();
  
  gameLoop();
}

function setupTouchControls() {
  // D-pad
  document.getElementById('btnUp').addEventListener('touchstart', () => touchControls.up = true);
  document.getElementById('btnUp').addEventListener('touchend', () => touchControls.up = false);
  
  document.getElementById('btnDown').addEventListener('touchstart', () => touchControls.down = true);
  document.getElementById('btnDown').addEventListener('touchend', () => touchControls.down = false);
  
  document.getElementById('btnLeft').addEventListener('touchstart', () => touchControls.left = true);
  document.getElementById('btnLeft').addEventListener('touchend', () => touchControls.left = false);
  
  document.getElementById('btnRight').addEventListener('touchstart', () => touchControls.right = true);
  document.getElementById('btnRight').addEventListener('touchend', () => touchControls.right = false);
  
  // Action buttons
  document.getElementById('btnShoot').addEventListener('touchstart', () => touchControls.shoot = true);
  document.getElementById('btnShoot').addEventListener('touchend', () => touchControls.shoot = false);
}

function getMergedControls() {
  return {
    'ArrowUp': keys['ArrowUp'] || keys['w'] || touchControls.up,
    'ArrowDown': keys['ArrowDown'] || keys['s'] || touchControls.down,
    'ArrowLeft': keys['ArrowLeft'] || keys['a'] || touchControls.left,
    'ArrowRight': keys['ArrowRight'] || keys['d'] || touchControls.right,
    'shoot': touchControls.shoot
  };
}

function gameLoop() {
  const mergedControls = getMergedControls();
  player.update(mergedControls, gameMap);
  renderer.render(player, gameMap);
  
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', init);
