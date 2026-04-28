class GameMap {
  constructor() {
    this.data = null;
    this.width = 0;
    this.height = 0;
  }

  async load(url) {
    const response = await fetch(url);
    this.data = await response.json();
    this.width = this.data.width;
    this.height = this.data.height;
  }

  getTile(x, y) {
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    
    if (tileX < 0 || tileX >= this.width || tileY < 0 || tileY >= this.height) {
      return 1; // muro se fuori mappa
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
