let gameMap;
let player;
let renderer;
let keys = {};

function init() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas not found');
    return;
  }
  
  renderer = new Renderer(canvas);
  gameMap = new GameMap();
  
  // Dati hardcoded
  gameMap.setData({
    width: 10,
    height: 10,
    tiles: [
      [1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,2,2,0,0,0,3,0,1],
      [1,0,2,2,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,4,4,0,0,0,0,1],
      [1,0,0,4,4,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1]
    ]
  });
  
  player = new Player(5, 5, 0);
  
  window.addEventListener('keydown', (e) => keys[e.key] = true);
  window.addEventListener('keyup', (e) => keys[e.key] = false);
  
  gameLoop();
}

function gameLoop() {
  player.update(keys, gameMap);
  renderer.render(player, gameMap);
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', init);
