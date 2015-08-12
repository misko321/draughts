var Board = function () {
  this.tiles = [];
  Tile.size = canvas.getWidth() / Board.tilesCount;
  Man.Radius = Tile.size * 0.4;
  Man.StrokeWidth = Man.Radius / 4;
  Man.board = this;

  for (var i = 0; i < Board.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Board.tilesCount; ++j) {
      var man;
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = new Tile(Tile.TileType.FORBIDDEN, i, j);
      else if (j < 4) {
        // man = new Man(Man.ManColor.BLACK, i, j);
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
        this.tiles[i][j].setMan(new ManBlack(this.tiles[i][j])); //TODO this.tiles[i][j].setMan...?
      }
      else if (j < 6)
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
      else {
        // man = new Man(Man.ManColor.WHITE, );
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
        this.tiles[i][j].setMan(new ManWhite(this.tiles[i][j]));
      }
  }
  }
};

Board.prototype.unselect = function() {
  if (this.selected)
    this.selected.unselect();
};

Board.tilesCount = 10;

// Board.prototype.findAllowedMovesForWhite = function(man) {
//   var x = man.tile.x - 1;
//   var y = man.tile.y - 1; //upper left
//
//   if (this.tiles[x][y] )
// };
