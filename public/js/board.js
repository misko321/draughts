var Board = function(tiles) {
  this.tiles = [];
  Tile.size = canvas.getWidth() / Board.tilesCount;
  Man.Radius = Tile.size * 0.4;
  Man.StrokeWidth = Man.Radius / 4;
  Man.board = this; //TODO capitalize or not? +REFACTOR
  Tile.board = this; //TODO capitalize or not? +REFACTOR
  this.selectedMan = undefined;
  this.myTurn = undefined;

  //TODO method too long? +REFACTOR
  for (var i = 0; i < tiles.length; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < tiles.length; ++j) {
      switch (tiles[i][j]) {
        case 'N': {
          this.tiles[i][j] = new Tile(Tile.TileType.NONPLAYABLE, i, j);
          break; }
        case 'B': {
          this.tiles[i][j] = new Tile(Tile.TileType.PLAYABLE, i, j);
          this.tiles[i][j].setMan(new ManBlack(this.tiles[i][j]));
          break; }
        case 'E': {
          this.tiles[i][j] = new Tile(Tile.TileType.PLAYABLE, i, j);
          break; }
        case 'W': {
          this.tiles[i][j] = new Tile(Tile.TileType.PLAYABLE, i, j);
          this.tiles[i][j].setMan(new ManWhite(this.tiles[i][j]));
          break; }

        default:
          console.error("Incorrect tile type");
      }
    }
  }
  $('.fade-in').fadeTo(Board.FadeTime, 1);
};

Board.tilesCount = 10;
Board.FadeTime = 1500;

Board.prototype.unselect = function() {
  if (this.selectedMan) {
    this.selectedMan.unselect();
    this.selectedMan = undefined;
  }
  for (var i in this.tilesAllowed) {
    this.tilesAllowed[i].clearHighlights();
  }
  this.tilesAllowed = [];
};

Board.prototype.getMen = function(type) {
  var men = [];
  for (var i = 0; i < this.tiles.length; ++i) {
    for (var j = 0; j < this.tiles.length; ++j) {
      if (this.tiles[i][j].man !== undefined && this.tiles[i][j].man instanceof type)
        men.push(this.tiles[i][j].man);
    }
  }

  return men;
};

Board.prototype.setPlayerColor = function(color) {
  this.playerColor = color;
  this.myTurn = true;
  // var men;
  //
  // if (this.playerColor === "black") {
  //   men = this.getMen(ManWhite);
  //   this.myTurn = false;
  // }
  // else {
  //   men = this.getMen(ManBlack);
  //   this.myTurn = true;
  // }
  //
  // for (var i = 0; i < men.length; ++i)
  //   men[i].disableSelectable();
};

Board.prototype.select = function(man) {
  //clear previous selection
  this.unselect();

  //apply new selection
  this.selectedMan = man;
  this.findAllowedMoves(this.selectedMan);
};

Board.prototype.onMoveCompleted = function(tile) {
  tile.clearHighlights();
  this.findAllowedMoves(this.selectedMan);

  // this.selectedMan.unselect();
};

Board.prototype.findAllowedMoves = function(man) {
  var allowed,
      relativePos;

  if (man instanceof ManWhite)
    relativePos = [ [1, -1], [-1, -1] ];
  else
    relativePos = [ [1, 1], [-1, 1] ];

  allowed = this.findAllowedMovesForMan(man, relativePos, null);
  for (var j in allowed)
    allowed[j].setAsAllowed();
  this.tilesAllowed = allowed;
};

Board.prototype.findAllowedMovesForMan = function(man, relativePos, beat) {
  var relativePosBeat = [ [-2, -2], [-2, 2], [2, -2], [ 2, 2] ]; //always the same
  var allowed = [];

  var tileToCheck,
      oppTileToCheck;
  for (var i in relativePos) {
    tileToCheck = {
      x: man.tile.x + relativePos[i][0],
      y: man.tile.y + relativePos[i][1]
    };
    if (this.areCoordsValid(tileToCheck) &&
      this.tiles[tileToCheck.x][tileToCheck.y].man === undefined)
        allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  for (var j in relativePosBeat) {
    tileToCheck = {
      x: man.tile.x + relativePosBeat[j][0],
      y: man.tile.y + relativePosBeat[j][1]
    };
    oppTileToCheck = {
      x: man.tile.x + relativePosBeat[j][0] / 2,
      y: man.tile.y + relativePosBeat[j][1] / 2,
    };
    if (this.areCoordsValid(tileToCheck) &&
      this.canBeat(tileToCheck, oppTileToCheck, man))
      allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  return allowed;
};

Board.prototype.canBeat = function(tile, oppTile, man) {
  return this.tiles[tile.x][tile.y].man === undefined &&
    this.tiles[oppTile.x][oppTile.y].man !== undefined &&
    this.tiles[oppTile.x][oppTile.y].man.Color === man.oppositeColor();
};

//TODO ->moveManTo(selectedMan, tile) +RETHINK +REFACTOR
Board.prototype.moveSelectedManTo = function(tile) {
  for (var i in this.tilesAllowed)
    this.tilesAllowed[i].clearHighlights();
  tile.setAsMovingToNow();

  this.selectedMan.moveToTile(tile, true);
  // changeTurn();
};

//TODO -> moveManTo(man, tile) +RETHINK +REFACTOR
Board.prototype.moveMan = function(fromX, fromY, toX, toY) {
  var fromTile = this.tiles[fromX][fromY];
  var toTile = this.tiles[toX][toY];

  if (fromTile.man !== undefined)
    fromTile.man.moveToTile(toTile, false);
};


// Board.prototype.getJumpCoords = function(x, y) {
//   var x = man.tile.x + xRelative;
//   var y = man.tile.y + yRelative;
//
//   if (!areCoordsValid(x, y))
//     return undefined;
//
//   return {
//     x: x,
//     y: y
//   };
// };

Board.prototype.areCoordsValid = function(tile) {
  return (tile.x >= 0 && tile.x < 10 && tile.y >= 0 && tile.y < 10);
};
