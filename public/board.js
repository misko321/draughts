var Board = function(tiles) {
  this.tiles = [];
  Tile.size = canvas.getWidth() / Board.tilesCount;
  Man.Radius = Tile.size * 0.4;
  Man.StrokeWidth = Man.Radius / 4;
  Man.board = this; //TODO capitalize or not?
  Tile.board = this; //TODO capitalize or not?
  this.selectedMan = undefined;

  for (var i = 0; i < tiles.length; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < tiles.length; ++j) {
      switch (tiles[i][j]) {
        case 'N': {
            this.tiles[i][j] = new Tile(Tile.TileType.NONPLAYABLE, i, j);
            break; }
        case 'B': {
            this.tiles[i][j] = new Tile(Tile.TileType.PLAYABLE, i, j);
            this.tiles[i][j].setMan(new ManBlack(this.tiles[i][j])); //TODO this.tiles[i][j].setMan...?
            break; }
        case 'E': {
            this.tiles[i][j] = new Tile(Tile.TileType.NONPLAYABLE, i, j);
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

Board.FadeTime = 500;

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

Board.prototype.select = function(man) {

  //clear previous selection
  this.unselect();

  //apply new selection
  this.selectedMan = man;
  if (man instanceof ManWhite) {
    var allowed = this.findAllowedMovesForWhite(man);
    for (var j in allowed)
      allowed[j].setAsAllowed();
    // canvas.renderAll();
    this.tilesAllowed = allowed;
  }
};

Board.tilesCount = 10;

Board.prototype.findAllowedMovesForWhite = function(man) {
  var relativePos = [ [-1, -1], [-1, 1], [1, -1], [1, 1] ];//, [-2, -2], [-2, 2], [2, -2], [2, 2] ];
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

  //TODO 8 separate functions?, have in mind multiple jumps

  // console.log(allowed);
  return allowed;
};

Board.prototype.moveSelectedManTo = function(tile) {
  //FIXME spaghetti code?

  for (var i in this.tilesAllowed)
    this.tilesAllowed[i].clearHighlights();
  tile.setAsMovingToNow();

  this.selectedMan.moveToTile(tile);
  this.selectedMan.tile.man = undefined; //clear man from previous tile
  tile.man = this.selectedMan; //set man at new tile
  this.selectedMan.tile = tile;
};

Board.prototype.onMoveCompleted = function(tile) {
  //FIXME DRY select() method
  tile.clearHighlights();
  var allowed = this.findAllowedMovesForWhite(this.selectedMan);
  for (var j in allowed)
    allowed[j].setAsAllowed();
  // canvas.renderAll();
  this.tilesAllowed = allowed;
  // console.log('onMoveCompleted');
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
