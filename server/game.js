var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
  this.tiles = [];
  this.players = [];
  this.hasStarted = false;
  this.turn = 'W';

  // for (var i = 0; i < Game.tilesCount; ++i) {
  //   this.tiles[i] = [];
  //   for (var j = 0; j < Game.tilesCount; ++j) {
  //     if ((i + j) % 2 === 0)
  //       this.tiles[i][j] = 'N'; //TODO enum instead of char? +RETHINK
  //     else if (j < 4)
  //       this.tiles[i][j] = 'B';
  //     else if (j < 6)
  //       this.tiles[i][j] = 'E';
  //     else {
  //       this.tiles[i][j] = 'W';
  //     }
  //   }
  // }
  for (var i = 0; i < Game.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Game.tilesCount; ++j) {
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = 'N'; //TODO enum instead of char? +RETHINK
      else if (j === 2 || j === 4 || j === 0)
        this.tiles[i][j] = 'B';
      else if (j === 5 || j === 7 || j === 9)
        this.tiles[i][j] = 'W';
      else {
        this.tiles[i][j] = 'E';
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
  if (player.color === 'W')
    this.playerWhite = player;
  else
    this.playerBlack = player;
};

Game.prototype.changeTurn = function() {
  this.turn = (this.turn === 'W' ? 'B' : 'W');
};

Game.prototype.leave = function(player) {
  --this.playersCount;
  if (this.hasStarted)
    player.disconnected = true;
  else  //TODO needed?, there can be only one player in this situation?
    this.players = [];
};

Game.prototype.rejoin = function(color) {
  // console.log(this.playersCount);
  if (color === 'W') {
    // console.log('c W');
    if (this.playerWhite.disconnected) {
      ++this.playersCount;
      this.playerWhite.disconnected = false;
      return this.playerWhite;
    }
  } else {
    // console.log('c B');
    if (this.playerBlack.disconnected) {
      ++this.playersCount;
      this.playerBlack.disconnected = false;
      return this.playerBlack;
    }
  }
};

Game.prototype.start = function() {
  var rand = Math.floor(Math.random() * 2);
  this.players[rand].color = 'B';
  this.playerBlack = this.players[rand];
  this.players[1 - rand].color = 'W';
  this.playerWhite = this.players[1 - rand];
  this.players = undefined;
  this.hasStarted = true;
};

//TODO check server-side if move is allowed +STD_FEATURE
Game.prototype.makeMove = function(move, player) {
  //validate data format
  if (!(move && move.from && move.from.x && move.from.y && move.to.x && move.to.y &&
    move.from.x >= 0 && move.from.x <= 9 && move.from.y >= 0 && move.from.y <= 9) &&
    move.to.x >= 0 && move.to.x <= 9 && move.to.y >= 0 && move.to.y <= 9 &&
    move.from.x !== move.to.x && move.from.y !== move.to.y)
      return false;
  console.log('1');
  //check if move has sense
  var stepX = move.from.x - move.to.x,
      stepY = move.from.y - move.to.y,
      absStepX = Math.abs(stepX),
      absStepY = Math.abs(stepY);
  if (absStepX > 2 || absStepY > 2 || absStepX !== absStepY)
    return false;
    console.log('2');

  var from = this.tiles[move.from.x][move.from.y],
  to = this.tiles[move.to.x][move.to.y];

  //check if men is present at source and can move to its destination
  if (this.turn !== player.color || from !== player.color || to !== 'E')
    return false;
    console.log('3');

  //one step move
  if (absStepX === 1 && player.color === 'W' && stepX !== -1) return false;
  if (absStepX === 1 && player.color === 'B' && stepX !== 1) return false;
  console.log('4');

  //two step move
  if (absStepX === 2) {
    var oppX = move.from.x + stepX / 2;
    var oppY = move.from.y + stepY / 2;
    if (player.color === 'W' && this.tiles[oppX][oppY] !== 'B') return false;
    if (player.color === 'B' && this.tiles[oppX][oppY] !== 'W') return false;
  }

  var man = this.tiles[move.from.x][move.from.y];
  this.tiles[move.from.x][move.from.y] = 'E';
  this.tiles[move.to.x][move.to.y] = man;

  return move;
};

module.exports = Game;
