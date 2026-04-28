class Player {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
  }

  update(keys, map) {
    const moveSpeed = CONFIG.PLAYER_SPEED;
    const rotSpeed = CONFIG.PLAYER_ROTATE_SPEED;

    // Rotazione
    if (keys['ArrowLeft'] || keys['a']) this.angle -= rotSpeed;
    if (keys['ArrowRight'] || keys['d']) this.angle += rotSpeed;

    // Movimento
    let newX = this.x;
    let newY = this.y;

    if (keys['ArrowUp'] || keys['w']) {
      newX += Math.cos(this.angle) * moveSpeed;
      newY += Math.sin(this.angle) * moveSpeed;
    }
    if (keys['ArrowDown'] || keys['s']) {
      newX -= Math.cos(this.angle) * moveSpeed;
      newY -= Math.sin(this.angle) * moveSpeed;
    }

    // Collision detection
    if (!map.isWall(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }
  }
}
