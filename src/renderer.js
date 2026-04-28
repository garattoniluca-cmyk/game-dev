class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(player, map) {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const fov = CONFIG.FOV;
    const halfFov = fov / 2;
    const numRays = this.width;

    for (let i = 0; i < numRays; i++) {
      const rayAngle = player.angle - halfFov + (i / numRays) * fov;
      const distance = this.castRay(player.x, player.y, rayAngle, map);
      const wallHeight = (CONFIG.WALL_HEIGHT / (distance + 0.0001));
      const brightness = Math.max(50, 255 - distance * 15);
      
      const tile = map.getTile(
        player.x + Math.cos(rayAngle) * distance,
        player.y + Math.sin(rayAngle) * distance
      );
      const color = map.getWallColor(tile);
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = brightness / 255;
      
      this.ctx.fillRect(i, (this.height - wallHeight) / 2, 1, wallHeight);
    }
    
    this.ctx.globalAlpha = 1.0;
  }

  castRay(x, y, angle, map) {
    let distance = 0;
    const step = 0.05;
    
    while (distance < CONFIG.MAX_DEPTH) {
      const nextX = x + Math.cos(angle) * distance;
      const nextY = y + Math.sin(angle) * distance;
      
      if (map.isWall(nextX, nextY)) {
        return distance;
      }
      
      distance += step;
    }
    
    return CONFIG.MAX_DEPTH;
  }
}
EOFcat > ~/.android/claude-repos/game-dev/src/renderer.js << 'EOF'
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(player, map) {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    const fov = CONFIG.FOV;
    const halfFov = fov / 2;
    const numRays = this.width;

    for (let i = 0; i < numRays; i++) {
      const rayAngle = player.angle - halfFov + (i / numRays) * fov;
      const distance = this.castRay(player.x, player.y, rayAngle, map);
      const wallHeight = (CONFIG.WALL_HEIGHT / (distance + 0.0001));
      const brightness = Math.max(50, 255 - distance * 15);
      
      const tile = map.getTile(
        player.x + Math.cos(rayAngle) * distance,
        player.y + Math.sin(rayAngle) * distance
      );
      const color = map.getWallColor(tile);
      this.ctx.fillStyle = color;
      this.ctx.globalAlpha = brightness / 255;
      
      this.ctx.fillRect(i, (this.height - wallHeight) / 2, 1, wallHeight);
    }
    
    this.ctx.globalAlpha = 1.0;
  }

  castRay(x, y, angle, map) {
    let distance = 0;
    const step = 0.05;
    
    while (distance < CONFIG.MAX_DEPTH) {
      const nextX = x + Math.cos(angle) * distance;
      const nextY = y + Math.sin(angle) * distance;
      
      if (map.isWall(nextX, nextY)) {
        return distance;
      }
      
      distance += step;
    }
    
    return CONFIG.MAX_DEPTH;
  }
}
