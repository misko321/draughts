var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
  this.tiles = [];
  this.players = [];
  this.hasStarted = false;
  this.turn = 'W';
  this.lastBeatMove = undefined;

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
  //TODO show message log +NOW
  ++this.playersCount;
  this.players.push(player);
  player.game = this;
  // if (player.color === 'W')
  //   this.playerWhite = player;
  // else
  //   this.playerBlack = player;
};

Game.prototype.changeTurn = function() {
  this.turn = this.oppositeColor(this.turn);
};

Game.prototype.leave = function(player) {
  --this.playersCount;
  if (this.hasStarted)
    player.disconnected = true;
  else  //TODO needed?, there can be only one player in this situation?
    this.players = [];
};

Game.prototype.rejoin = function(color) {
  //TODO show message log +NOW
  // console.log(this.playersCount);
  if (color === 'white') {
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
  //TODO show message log +NOW
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
  if (move.to.x >= 0)
    console.log('strange');
  console.log(move);
  if (!(move && move.from && move.from.x !== undefined && move.from.y !== undefined &&
    move.to.x !== undefined && move.to.y !== undefined &&
    +move.from.x >= 0 && +move.from.x <= 9 && +move.from.y >= 0 && +move.from.y <= 9 &&
    +move.to.x >= 0 && +move.to.x <= 9 && +move.to.y >= 0 && +move.to.y <= 9 &&
    +move.from.x !== +move.to.x && +move.from.y !== +move.to.y))
      return false;
  console.log('1');
  //check if move has sense
  var stepX = move.to.x - move.from.x,
      stepY = move.to.y - move.from.y,
      absStepX = Math.abs(stepX),
      absStepY = Math.abs(stepY);
  if (absStepX > 2 || absStepY > 2 || absStepX !== absStepY)
    return false;
    console.log('2');

  var from = this.tiles[move.from.x][move.from.y],
  to = this.tiles[move.to.x][move.to.y];

  //check if men is present at source and can move to its destination
  console.log(this.turn + ', ' + player.color + ', '+ from + ', ' + to);
  if (this.turn !== player.color || from !== player.color || to !== 'E')
    return false;
  console.log('3');

  //one step move
  console.log(absStepX + ', ' + absStepY + ', ' + stepX + ', ' + stepY + ', ');
  if (absStepY === 1 && player.color === 'W' && stepY !== -1) return false;
  if (absStepY === 1 && player.color === 'B' && stepY !== 1) return false;
  console.log('4');
  console.log(this.lastBeatMove);
  console.log(move.from);

  if (this.lastBeatMove && (move.from.x !== this.lastBeatMove.x || move.from.y !== this.lastBeatMove.y ||
                            absStepX !== 2))
    return false;

  console.log('5');

  //two step move
  var opp, oppX, oppY;
  if (absStepX === 2) {
    console.log('a ' + move.from.x + ', ' + stepX + ', ' + (+move.from.x + stepX / 2));
    oppX = +move.from.x + stepX / 2;
    oppY = +move.from.y + stepY / 2;
    opp = this.tiles[oppX][oppY];
    console.log('b ' + oppX + ', ' + oppY + ', ' + player.color + ', ' + opp);
    if (player.color === 'W' && opp !== 'B') return false;
    if (player.color === 'B' && opp !== 'W') return false;
  }
  console.log('6');
  var man = from;
  console.log(from + ', ' + to);
  this.tiles[move.from.x][move.from.y] = 'E';
  this.tiles[move.to.x][move.to.y] = man;
  to = man;
  if (absStepX === 2) {
    this.tiles[oppX][oppY] = 'E';
    if (this.moreMovesAvailable(move.to.x, move.to.y, player.color) > 0) {
      this.lastBeatMove = { x: move.to.x, y: move.to.y, color: player.color };
    } else {
      this.changeTurn();
      move.changeTurn = true;
      this.lastBeatMove = undefined;
    }
    move.manToBeat = { x: oppX, y: oppY };
  }
  if (absStepX === 1) {
    this.changeTurn();
    move.changeTurn = true;
  }

  return move;
};

Game.prototype.moreMovesAvailable = function(x, y, color) {
  var relativePosBeat = [ [-2, -2], [-2, 2], [2, -2], [ 2, 2] ]; //always the same
  var allowed = 0;
  console.log('moreMovesAvailable 1:' + x + ', ' + y);
  for (var i in relativePosBeat) {
    var tileToCheck = {
      'x': +x + relativePosBeat[i][0],
      'y': +y + relativePosBeat[i][1]
    };
    var oppTileToCheck = {
      'x': +x + relativePosBeat[i][0] / 2,
      'y': +y + relativePosBeat[i][1] / 2,
    };
    if (this.areCoordsValid(tileToCheck) &&
      this.canBeat(tileToCheck, oppTileToCheck, color))
        ++allowed;
  }
  console.log('moreMovesAvailable ' + allowed);
  return allowed > 0;
};

Game.prototype.canBeat = function(tile, oppTile, color) {
  var res =  this.tiles[tile.x][tile.y] === 'E' &&
    this.tiles[oppTile.x][oppTile.y] === this.oppositeColor(color);
  console.log('canBeat ' + res);
  return res;
};

Game.prototype.oppositeColor = function(color) {
  return (color === 'W' ? 'B' : 'W');
};

Game.prototype.areCoordsValid = function(tile) {
  var res =   (tile.x >= 0 && tile.x < 10 && tile.y >= 0 && tile.y < 10);
  console.log('areCoordsValid ' + tile.x + ', ' + tile.y + res);
  return res;
};

module.exports = Game;
