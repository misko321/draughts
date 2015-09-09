var Board = function(tiles) {
  //initialize graphics
  Tile.size = canvas.getWidth() / Board.tilesCount;
  Man.Radius = Tile.size * 0.4;
  Man.StrokeWidth = Man.Radius / 4;

  //initialize this
  this.tiles = [];
  this.selectedMan = undefined;
  this.myTurn = undefined;
  this.lastMoveWasBeat = undefined;

  this.loadTiles(tiles);

  $('.fade-in').fadeTo(Board.FadeTime, 1);
};

Board.prototype.loadTiles = function(tiles) {
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
          console.error("Incorrect tile type: " + tiles[i][j]);
      }
    }
  }
};

Board.tilesCount = 10;
Board.FadeTime = 1500;

Board.prototype.unselect = function() {
  if (this.lastMoveWasBeat === undefined) { //disallow unselecting when move in progress
    if (this.selectedMan) {
      this.selectedMan.unselect();
      this.selectedMan = undefined;
    }
    this.clearAllHighlights();
    this.tilesAllowed = [];
  }
};

Board.prototype.getMenOfType = function(type) {
  var men = [];
  for (var i = 0; i < this.tiles.length; ++i) {
    for (var j = 0; j < this.tiles.length; ++j) {
      if (this.tiles[i][j].man !== undefined && this.tiles[i][j].man instanceof type)
        men.push(this.tiles[i][j].man);
    }
  }

  return men;
};

Board.prototype.setPlayerColor = function(color, turn) {
  this.playerColor = color;
  if(color === turn)
    this.myTurn = true;
  setTurn(turn);

  //disallow selecting of opponent's men
  var men = (color === "white" ? this.getMenOfType(ManBlack) : this.getMenOfType(ManWhite));
  for (var i = 0; i < men.length; ++i)
    men[i].disableSelectable();
};

Board.prototype.select = function(man) {
  //if already selected or not my turn
  if (!this.myTurn || this.selectedMan === man)
    return;

  //clear previous selection
  this.unselect();

  //apply new selection
  if (this.selectedMan === undefined) {
    man.selectAnimation();
    this.selectedMan = man;
    this.findAllowedMoves(this.selectedMan);
  }
};

Board.prototype.onMoveCompleted = function(tile) {
  tile.clearHighlights();
  this.findAllowedMoves(this.selectedMan);
};

Board.prototype.findAllowedMoves = function(man) {
  var relativePos = (man instanceof ManWhite ? [ [1, -1], [-1, -1] ] : [ [1, 1], [-1, 1] ]),
      allowed = [],
      allowedForBeat = [];

  allowedForBeat = this.findAllowedMovesBeat(man);
  if (allowedForBeat.length === 0 && !this.lastMoveWasBeat) //if beat is possible, disallow simple moves
    allowed = this.findAllowedMovesNoBeat(man, relativePos);
  this.tilesAllowed = allowed.concat(allowedForBeat);

  if (this.tilesAllowed.length === 0 || this.lastMoveWasBeat === false) { //finish move
    this.selectedMan.unselect();
    this.selectedMan = undefined;
    this.lastMoveWasBeat = undefined;
    changeTurn();
  } else {
    for (var j in allowedForBeat)
      allowedForBeat[j].setAsAllowedForBeat();
    for (var i in allowed)
      allowed[i].setAsAllowed();
  }
};

Board.prototype.findAllowedMovesNoBeat = function(man, relativePos) {
  var allowed = [];

  for (var i in relativePos) {
    var tileToCheck = {
      x: man.tile.x + relativePos[i][0],
      y: man.tile.y + relativePos[i][1]
    };
    if (this.areCoordsValid(tileToCheck) &&
      this.tiles[tileToCheck.x][tileToCheck.y].man === undefined)
        allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  return allowed;
};

Board.prototype.findAllowedMovesBeat = function(man) {
  var relativePosBeat = [ [-2, -2], [-2, 2], [2, -2], [ 2, 2] ]; //always the same
  var allowed = [];

  for (var i in relativePosBeat) {
    var tileToCheck = {
      x: man.tile.x + relativePosBeat[i][0],
      y: man.tile.y + relativePosBeat[i][1]
    };
    var oppTileToCheck = {
      x: man.tile.x + relativePosBeat[i][0] / 2,
      y: man.tile.y + relativePosBeat[i][1] / 2,
    };
    if (this.areCoordsValid(tileToCheck) &&
      this.canBeat(tileToCheck, oppTileToCheck, man))
      allowed.push(this.tiles[tileToCheck.x][tileToCheck.y]);
  }

  return allowed;
};

Board.prototype.areCoordsValid = function(tile) {
  return (tile.x >= 0 && tile.x < 10 && tile.y >= 0 && tile.y < 10);
};

Board.prototype.canBeat = function(tile, oppTile, man) {
  return this.tiles[tile.x][tile.y].man === undefined &&
    this.tiles[oppTile.x][oppTile.y].man !== undefined &&
    this.tiles[oppTile.x][oppTile.y].man.Color === man.oppositeColor();
};

Board.prototype.moveSelectedManTo = function(tile) {
  this.lastMoveWasBeat = (tile.isAllowedForBeat ? true : false);
  if (tile.isAllowedForBeat) {
    var oppX = this.selectedMan.tile.x + (tile.x - this.selectedMan.tile.x) / 2;
    var oppY = this.selectedMan.tile.y + (tile.y - this.selectedMan.tile.y) / 2;

    this.destroyMan(this.tiles[oppX][oppY].man);
  }
  this.selectedMan.moveToTile(tile, true);
  this.clearAllHighlights();
  tile.setAsMovingToNow();
};

Board.prototype.destroyMan = function(man) {
  man.tile.clearMan();
  man.destroy();
};

Board.prototype.clearAllHighlights = function() {
  for (var i in this.tilesAllowed)
    this.tilesAllowed[i].clearHighlights();
};

//opponent's move received through WebSocket
Board.prototype.moveOpponentsMan = function(from, to, manToBeat) {
  var fromTile = this.tiles[from.x][from.y];
  var toTile = this.tiles[to.x][to.y];

  fromTile.man.moveToTile(toTile, false);
  if (manToBeat)
    this.destroyMan(this.tiles[manToBeat.x][manToBeat.y].man);
};

Board.prototype.sendMove = function(from, to) {
  websocket.sendMove(from, to);
};
