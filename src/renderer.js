class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  render(player, map) {
    // Sfondo nero
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Testo di debug
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '16px Arial';
    this.ctx.fillText('Player: ' + player.x.toFixed(2) + ',' + player.y.toFixed(2), 10, 30);
    this.ctx.fillText('Angle: ' + (player.angle * 180 / Math.PI).toFixed(1) + '°', 10, 50);

    // Semplice vista 2D della mappa
    const scale = 40;
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        if (map.getTile(x, y) === 0) {
          this.ctx.fillStyle = '#222222';
        } else {
          this.ctx.fillStyle = '#888888';
        }
        this.ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    // Disegna player
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(player.x * scale - 5, player.y * scale - 5, 10, 10);

    // Disegna direzione
    this.ctx.strokeStyle = '#00FF00';
    this.ctx.beginPath();
    this.ctx.moveTo(player.x * scale, player.y * scale);
    this.ctx.lineTo(player.x * scale + Math.cos(player.angle) * 20, player.y * scale + Math.sin(player.angle) * 20);
    this.ctx.stroke();
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
