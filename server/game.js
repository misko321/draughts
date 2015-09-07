var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
  this.tiles = [];
  this.players = [];

  for (var i = 0; i < Game.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Game.tilesCount; ++j) {
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = 'N'; //TODO enum instead of char? +RETHINK
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

//TODO array[color] +REFACTOR
Game.prototype.join = function(player) {
  ++this.playersCount;
  this.players.push(player);
  player.game = this;
  if (player.color === "white")
    this.playerWhite = player;
  else
    this.playerBlack = player;
};

Game.prototype.leave = function(player) {
  --this.playersCount;
  player.disconnected = true;
};

Game.prototype.rejoin = function(color) {
  // console.log(this.playersCount);
  if (color === "white") {
    // console.log('c white');
    if (this.playerWhite.disconnected) {
      ++this.playersCount;
      this.playerWhite.disconnected = false;
      return this.playerWhite;
    }
  } else {
    // console.log('c black');
    if (this.playerBlack.disconnected) {
      ++this.playersCount;
      this.playerBlack.disconnected = false;
      return this.playerBlack;
    }
  }
};

Game.prototype.start = function() {
  var rand = Math.floor(Math.random() * 2);
  this.players[rand].color = "black";
  this.playerBlack = this.players[rand];
  this.players[1 - rand].color = "white";
  this.playerWhite = this.players[1 - rand];
  this.players = undefined;
};

//TODO check server-side if move is allowed +STD_FEATURE
Game.prototype.makeMove = function(move) {
  var man = this.tiles[move.fromX][move.fromY];
  this.tiles[move.fromX][move.fromY] = 'E';
  this.tiles[move.toX][move.toY] = man;
};

module.exports = Game;
