var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
  this.tiles = [];

  for (var i = 0; i < Game.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Game.tilesCount; ++j) {
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = 'N';
      else if (j < 4)
        this.tiles[i][j] = 'B';
      else if (j < 6)
        this.tiles[i][j] = 'E';
      else {
        this.tiles[i][j] = 'W';
      }
    }
  }
};

Game.tilesCount = 10;

Game.prototype.join = function() {
  ++this.playersCount;
};

Game.prototype.rejoin = function() {};

//TODO check server-side if move is allowed
Game.prototype.makeMove = function(move) {
  var man = this.tiles[move.fromX][move.fromY];
  this.tiles[move.fromX][move.fromY] = 'E';
  this.tiles[move.toX][move.toY] = man;
};

module.exports = Game;
