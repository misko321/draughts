var Board = function () {
  this.tiles = [];

  for (var i = 0; i < TILES_COUNT; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < TILES_COUNT; ++j) {
      if ((i + j) % 2 == 0)
        this.tiles[i][j] = new Tile(Tile.TileType.FORBIDDEN);
      else if (i < 4)
        this.tiles[i][j] = new Tile(Tile.TileType.BLACK);
      else if (i < 6)
        this.tiles[i][j] = new Tile(Tile.TileType.BLANK);
      else
        this.tiles[i][j] = new Tile(Tile.TileType.WHITE);
    }
  }
};

Board.prototype.draw = function() {
  this.clear();
  this.drawBoardBase();
  this.drawMen();
  if (mousePos) {
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}

Board.prototype.clear = function() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  GraphicsContext.drawRectangle(0, 0, canvas.width, canvas.height, "#d9d9d9");
}

Board.prototype.drawBoardBase = function() {
  GraphicsContext.setFillStyle("#979797");

  for (var i = 0; i < 5; ++i) {
    for (var j = 0; j < 5; ++j) {
      GraphicsContext.drawRectangle(tile*(2*j+1), tile*(2*i), canvas.width / 10, canvas.height / 10);
      GraphicsContext.drawRectangle(tile*(2*j), tile*(2*i+1), canvas.width / 10, canvas.height / 10);
    }
  }
}

Board.prototype.drawMen = function() {
  var radius = 12;

  for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 10; ++j) {
      switch (this.tiles  [i][j].type) {
        case Tile.TileType.BLACK:
          GraphicsContext.drawCircle(j*tile + 0.5*tile, i*tile + 0.5*tile, radius, "#2c2c2c");
          break;
        case Tile.TileType.WHITE:
          GraphicsContext.drawCircle(j*tile + 0.5*tile, i*tile + 0.5*tile, radius, "#f0f0f0");
          break;
        default: break;
        }
    }
  }
}
