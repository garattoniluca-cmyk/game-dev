class GameMap {
  constructor() {
    this.data = null;
    this.width = 0;
    this.height = 0;
  }

  setData(data) {
    this.data = data;
    this.width = data.width;
    this.height = data.height;
  }

  getTile(x, y) {
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    
    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
      return 1;
    }
    
    return this.data.tiles[tileY][tileX];
  }

  isWall(x, y) {
    return this.getTile(x, y) !== 0;
  }

  getWallColor(tile) {
    return CONFIG.COLORS[tile] || '#FFFFFF';
  }
}
