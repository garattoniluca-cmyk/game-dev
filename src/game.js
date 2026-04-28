class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    this.player = {
      x: LEVEL.playerStart.x,
      y: LEVEL.playerStart.y,
      angle: LEVEL.playerStart.angle,
      moveSpeed: 0.08,
      rotSpeed: 0.05
    };
    
    this.fov = Math.PI / 3;
    this.numRays = 200;
    this.maxDepth = 20;
    
    this.controls = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      strafeLeft: false,
      strafeRight: false
    };
    
    this.setupControls();
    window.addEventListener('resize', () => this.resize());
    
    this.lastTime = 0;
    requestAnimationFrame((t) => this.loop(t));
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  
  setupControls() {
    // Keyboard
    const keyMap = {
      'ArrowUp': 'forward', 'w': 'forward',
      'ArrowDown': 'backward', 's': 'backward',
      'ArrowLeft': 'left', 'a': 'left',
      'ArrowRight': 'right', 'd': 'right',
      'q': 'strafeLeft', 'e': 'strafeRight'
    };
    
    window.addEventListener('keydown', (e) => {
      if (keyMap[e.key]) this.controls[keyMap[e.key]] = true;
    });
    window.addEventListener('keyup', (e) => {
      if (keyMap[e.key]) this.controls[keyMap[e.key]] = false;
    });
    
    // Touch buttons
    const setupBtn = (id, control) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const start = (e) => { e.preventDefault(); this.controls[control] = true; };
      const end = (e) => { e.preventDefault(); this.controls[control] = false; };
      btn.addEventListener('touchstart', start);
      btn.addEventListener('touchend', end);
      btn.addEventListener('mousedown', start);
      btn.addEventListener('mouseup', end);
      btn.addEventListener('mouseleave', end);
    };
    
    setupBtn('btnUp', 'forward');
    setupBtn('btnDown', 'backward');
    setupBtn('btnLeft', 'left');
    setupBtn('btnRight', 'right');
    setupBtn('btnStrafeL', 'strafeLeft');
    setupBtn('btnStrafeR', 'strafeRight');
  }
  
  getMapAt(x, y) {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || mx >= LEVEL.width || my < 0 || my >= LEVEL.height) return 1;
    return LEVEL.map[my * LEVEL.width + mx];
  }
  
  update() {
    const p = this.player;
    
    if (this.controls.left) p.angle -= p.rotSpeed;
    if (this.controls.right) p.angle += p.rotSpeed;
    
    let dx = 0, dy = 0;
    
    if (this.controls.forward) {
      dx += Math.cos(p.angle) * p.moveSpeed;
      dy += Math.sin(p.angle) * p.moveSpeed;
    }
    if (this.controls.backward) {
      dx -= Math.cos(p.angle) * p.moveSpeed;
      dy -= Math.sin(p.angle) * p.moveSpeed;
    }
    if (this.controls.strafeLeft) {
      dx += Math.cos(p.angle - Math.PI/2) * p.moveSpeed;
      dy += Math.sin(p.angle - Math.PI/2) * p.moveSpeed;
    }
    if (this.controls.strafeRight) {
      dx += Math.cos(p.angle + Math.PI/2) * p.moveSpeed;
      dy += Math.sin(p.angle + Math.PI/2) * p.moveSpeed;
    }
    
    // Collision detection con margine
    const margin = 0.2;
    if (this.getMapAt(p.x + dx + Math.sign(dx) * margin, p.y) === 0) p.x += dx;
    if (this.getMapAt(p.x, p.y + dy + Math.sign(dy) * margin) === 0) p.y += dy;
  }
  
  castRay(angle) {
    const p = this.player;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    
    let distance = 0;
    const step = 0.02;
    let hit = 0;
    
    while (distance < this.maxDepth) {
      distance += step;
      const x = p.x + cos * distance;
      const y = p.y + sin * distance;
      
      const tile = this.getMapAt(x, y);
      if (tile > 0) {
        hit = tile;
        break;
      }
    }
    
    return { distance, hit };
  }
  
  render() {
    // Sky
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height / 2);
    
    // Floor
    this.ctx.fillStyle = '#3a2a1a';
    this.ctx.fillRect(0, this.height / 2, this.width, this.height / 2);
    
    // Raycasting
    const rayWidth = this.width / this.numRays;
    const halfFov = this.fov / 2;
    
    for (let i = 0; i < this.numRays; i++) {
      const rayAngle = this.player.angle - halfFov + (i / this.numRays) * this.fov;
      const { distance, hit } = this.castRay(rayAngle);
      
      // Fix fisheye
      const correctedDist = distance * Math.cos(rayAngle - this.player.angle);
      
      // Wall height
      const wallHeight = Math.min(this.height, (this.height / correctedDist) * 0.8);
      const wallTop = (this.height - wallHeight) / 2;
      
      // Wall color con shading distanza
      const baseColor = LEVEL.wallColors[hit] || [200, 200, 200];
      const brightness = Math.max(0.3, 1 - correctedDist / this.maxDepth);
      const r = Math.floor(baseColor[0] * brightness);
      const g = Math.floor(baseColor[1] * brightness);
      const b = Math.floor(baseColor[2] * brightness);
      
      this.ctx.fillStyle = `rgb(${r},${g},${b})`;
      this.ctx.fillRect(i * rayWidth, wallTop, rayWidth + 1, wallHeight);
    }
    
    // Mini-map
    this.renderMinimap();
    
    // Crosshair
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width/2 - 10, this.height/2);
    this.ctx.lineTo(this.width/2 + 10, this.height/2);
    this.ctx.moveTo(this.width/2, this.height/2 - 10);
    this.ctx.lineTo(this.width/2, this.height/2 + 10);
    this.ctx.stroke();
  }
  
  renderMinimap() {
    const size = 150;
    const tileSize = size / LEVEL.width;
    const x0 = 10;
    const y0 = 10;
    
    this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
    this.ctx.fillRect(x0 - 2, y0 - 2, size + 4, size + 4);
    
    for (let y = 0; y < LEVEL.height; y++) {
      for (let x = 0; x < LEVEL.width; x++) {
        const tile = LEVEL.map[y * LEVEL.width + x];
        if (tile > 0) {
          const c = LEVEL.wallColors[tile];
          this.ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
          this.ctx.fillRect(x0 + x * tileSize, y0 + y * tileSize, tileSize, tileSize);
        }
      }
    }
    
    // Player
    this.ctx.fillStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.arc(x0 + this.player.x * tileSize, y0 + this.player.y * tileSize, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Direction
    this.ctx.strokeStyle = '#0f0';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x0 + this.player.x * tileSize, y0 + this.player.y * tileSize);
    this.ctx.lineTo(
      x0 + (this.player.x + Math.cos(this.player.angle) * 0.5) * tileSize,
      y0 + (this.player.y + Math.sin(this.player.angle) * 0.5) * tileSize
    );
    this.ctx.stroke();
  }
  
  loop(time) {
    this.update();
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
