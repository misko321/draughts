var Board = function(tiles) {
  this.tiles = [];
  Tile.size = canvas.getWidth() / Board.tilesCount;
  Man.Radius = Tile.size * 0.4;
  Man.StrokeWidth = Man.Radius / 4;
  Man.board = this; //TODO capitalize or not? +REFACTOR
  Tile.board = this; //TODO capitalize or not? +REFACTOR
  this.selectedMan = undefined;
  this.myMove = undefined;

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
  var men;

  if (this.playerColor === "black") {
    men = this.getMen(ManWhite);
    this.myMove = false;
  }
  else {
    men = this.getMen(ManBlack);
    this.myMove = true;
  }

  for (var i = 0; i < men.length; ++i)
    men[i].disableSelectable();
};

Board.prototype.select = function(man) {
  //clear previous selection
  this.unselect();

  //apply new selection
  this.selectedMan = man;
  var allowed;
  if (man instanceof ManWhite)
    allowed = this.findAllowedMovesForWhite(man);
  else
    allowed = this.findAllowedMovesForBlack(man);

  for (var j in allowed)
    allowed[j].setAsAllowed();
  this.tilesAllowed = allowed;
};

Board.prototype.findAllowedMovesForWhite = function(man) {
  var relativePos = [ [1, -1], [-1, -1] ];//, [-2, -2], [-2, 2], [2, -2], [2, 2] ];
  var allowed = [];

  for (var i in relativePos) {
    var tileToCheck = {
      x: man.tile.x + relativePos[i][0],
      y: man.tile.y + relativePos[i][1]
    };
    if (this.areCoordsValid(tileToCheck.x, tileToCheck.y) &&
      this.tiles[tileToCheck.x][tileToCheck.y].man === undefined)
        allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  //TODO 8 separate functions? Have in mind multiple jumps +STD_FEATURE

  return allowed;
};

Board.prototype.findAllowedMovesForBlack = function(man) {
  var relativePos = [ [1, 1], [-1, 1] ];//, [-2, -2], [-2, 2], [2, -2], [2, 2] ];
  var allowed = [];

  for (var i in relativePos) {
    var tileToCheck = {
      x: man.tile.x + relativePos[i][0],
      y: man.tile.y + relativePos[i][1]
    };
    if (this.areCoordsValid(tileToCheck.x, tileToCheck.y) &&
      this.tiles[tileToCheck.x][tileToCheck.y].man === undefined)
        allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  //TODO 8 separate functions? Have in mind multiple jumps +STD_FEATURE

  return allowed;
};

//TODO ->moveManTo(selectedMan, tile) +RETHINK +REFACTOR
Board.prototype.moveSelectedManTo = function(tile) {
  for (var i in this.tilesAllowed)
    this.tilesAllowed[i].clearHighlights();
  tile.setAsMovingToNow();

  this.selectedMan.moveToTile(tile, true);
};

//TODO -> moveManTo(man, tile) +RETHINK +REFACTOR
Board.prototype.moveMan = function(fromX, fromY, toX, toY) {
  var fromTile = this.tiles[fromX][fromY];
  var toTile = this.tiles[toX][toY];

  if (fromTile.man !== undefined)
    fromTile.man.moveToTile(toTile, false);
};

Board.prototype.onMoveCompleted = function(tile) {
  //FIXME DRY select() method +REFACTOR
  tile.clearHighlights();
  var allowed = this.findAllowedMovesForWhite(this.selectedMan);
  for (var j in allowed)
    allowed[j].setAsAllowed();
  this.tilesAllowed = allowed;
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

Board.prototype.areCoordsValid = function(x, y) {
  return (x >= 0 && x < 10 && y >= 0 && y < 10);
};
