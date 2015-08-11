var Board = function () {
  this.tiles = [];
  Tile.size = canvas.getWidth() / Board.tilesCount;

  for (var i = 0; i < Board.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Board.tilesCount; ++j) {
      var man;
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = new Tile(Tile.TileType.FORBIDDEN, i, j);
      else if (j < 4) {
        // man = new Man(Man.ManColor.BLACK, i, j);
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
        new Man(Man.ManColor.BLACK, this.tiles[i][j]);
      }
      else if (j < 6)
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
      else {
        // man = new Man(Man.ManColor.WHITE, );
        this.tiles[i][j] = new Tile(Tile.TileType.ALLOWED, i, j);
        new Man(Man.ManColor.WHITE, this.tiles[i][j]);
      }
  }
  }
};
Board.tilesCount = 10;

Board.prototype.draw = function() {
  // this.clear();
  this.drawBoardBase();
  // this.drawMen();
  // if (mousePos) {
  //   ctx.fillStyle = "#f5f5f5";
  //   ctx.beginPath();
  //   ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI, false);
  //   ctx.fill();
  // }
};

Board.prototype.clear = function() {
  GraphicsContext.drawRectangle(0, 0, canvas.width, canvas.height, "#d9d9d9");
};

Board.prototype.drawBoardBase = function() {
  // GraphicsContext.setFillStyle("#979797");

  // for (var i = 0; i < 5; ++i) {
  //   for (var j = 0; j < 5; ++j) {
  //     GraphicsContext.drawRectangle(tile*(2*j+1), tile*(2*i), canvas.width / 10, canvas.height / 10);
  //     GraphicsContext.drawRectangle(tile*(2*j), tile*(2*i+1), canvas.width / 10, canvas.height / 10);
  //   }
  // }

  // Tile.size = canvas.width / 10;
  // for (var i = 0; i < 10; ++i) {
  //   for (var j = 0; j < 10; ++j) {
  //     GraphicsContext.save();
  //     GraphicsContext.translate(Tile.size*i, Tile.size*j);
  //     this.tiles[i][j].draw();
  //     GraphicsContext.restore();
  //   }
  // }
  // var rect = new fabric.Rect({
  //   left: 100,
  //   top: 100,
  //   fill: 'red',
  //   width: 20,
  //   height: 20
  // });
  //
  // // "add" rectangle onto canvas
  // canvas.add(rect);
};

Board.prototype.drawMen = function() {
  var radius = 12;

  for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 10; ++j) {
      //translate context, so tiles don't need to know where they're located on the board
      GraphicsContext.save();
      GraphicsContext.translate(j*tile + 0.5*tile, i*tile + 0.5*tile);
      this.tiles[i][j].draw();
      GraphicsContext.restore();
      switch (this.tiles[i][j].type) {
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
};
