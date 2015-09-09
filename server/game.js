var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
  this.tiles = [];
  this.players = [];
  this.hasStarted = false;
  this.turn = 'W';
  this.lastMoveWasBeat = undefined;

  // for (var i = 0; i < Game.tilesCount; ++i) {
  //   this.tiles[i] = [];
  //   for (var j = 0; j < Game.tilesCount; ++j) {
  //     if ((i + j) % 2 === 0)
  //       this.tiles[i][j] = 'N';
  //     else if (j < 4)
  //       this.tiles[i][j] = 'B';
  //     else if (j < 6)
  //       this.tiles[i][j] = 'E';
  //     else {
  //       this.tiles[i][j] = 'W';
  //     }
  //   }
  // }

  //FOR QUICK TESTING:
  for (var i = 0; i < Game.tilesCount; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < Game.tilesCount; ++j) {
      if ((i + j) % 2 === 0)
        this.tiles[i][j] = 'N';
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

Game.prototype.join = function(player) {
  console.log('Player ' + player.username + ' joined ' + this.token + ' game');
  ++this.playersCount;
  this.players.push(player);
  player.game = this;
};

Game.prototype.changeTurn = function() {
  this.turn = this.oppositeColor(this.turn);
};

Game.prototype.leave = function(player) {
  --this.playersCount;
  if (this.hasStarted)
    player.disconnected = true;
  else
    this.players = [];
};

Game.prototype.rejoin = function(color) {

  if (this.players[color].disconnected) {
    console.log('Player ' + this.players[color].username + ' rejoined ' + this.token + ' game');
    ++this.playersCount;
    this.players[color].disconnected = false;
    return this.players[color];
  }
};

Game.prototype.start = function() {
  console.log('Game ' + this.token + ' commenced');

  var rand = Math.floor(Math.random() * 2);
  this.players.white = this.players[rand];
  this.players.white.color = 'W';
  this.players.black = this.players[1 - rand];
  this.players.black.color = 'B';

  this.players[rand] = this.players[1 - rand] = undefined;
  this.hasStarted = true;
};

Game.prototype.makeMove = function(move, player) {
  //validate move
  if (!this.isDataValid(move)) return false;
  var steps = this.isStepValid(move);
  if (!steps) return false;
  var pos = this.isMoveAllowed(move, player);
  if (!pos) return false;
  if (!this.isDirectionValid(steps, player)) return false;
  if (!this.isNextBeatValid(move, steps)) return false;
  var opp = this.isBeatValid(move, steps, player);
  if (!opp) return false;

  //if everything's allright -> apply move
  var moveProcessed = this.applyMove(move, steps, opp, player);
  return moveProcessed;
};

Game.prototype.isDataValid = function(move) {
  if (move && move.from && move.from.x !== undefined && move.from.y !== undefined &&
    move.to.x !== undefined && move.to.y !== undefined &&
    +move.from.x >= 0 && +move.from.x <= 9 && +move.from.y >= 0 && +move.from.y <= 9 &&
    +move.to.x >= 0 && +move.to.x <= 9 && +move.to.y >= 0 && +move.to.y <= 9 &&
    +move.from.x !== +move.to.x && +move.from.y !== +move.to.y) {
      move.from.x = +move.from.x;
      move.from.y = +move.from.y;
      move.to.x = +move.to.x;
      move.to.y = +move.to.y;

      return true;
    }
  return false;
};

Game.prototype.isStepValid = function(move) {
  var steps = {};
  steps.x = move.to.x - move.from.x;
  steps.y = move.to.y - move.from.y;
  steps.xAbs = Math.abs(steps.x);
  steps.yAbs = Math.abs(steps.y);
  if (steps.xAbs > 2 || steps.yAbs > 2 || steps.xAbs !== steps.yAbs)
    return false;
  return steps;
};

Game.prototype.isMoveAllowed = function(move, player) {
  if (this.turn === player.color && this.tiles[move.from.x][move.from.y] === player.color &&
    this.tiles[move.to.x][move.to.y] === 'E') {
    var pos = {};
    pos.from = this.tiles[move.from.x][move.from.y];
    pos.to = this.tiles[move.to.x][move.to.y];

    return pos;
  }

  return undefined;
};

Game.prototype.isDirectionValid = function(steps, player) {
  if ( (steps.yAbs === 1 && player.color === 'W' && steps.y === -1) ||
       (steps.yAbs === 1 && player.color === 'B' && steps.y === 1) ||
       (steps.yAbs === 2) )
    return true;
  return false;
};

Game.prototype.isNextBeatValid = function(move, steps) {
  if (this.lastMoveWasBeat) {
    if (move.from.x === this.lastMoveWasBeat.x &&
    move.from.y === this.lastMoveWasBeat.y && steps.xAbs === 2)
      return true;
  } else
    return true;
  return false;
};

Game.prototype.isBeatValid = function(move, steps, player) {
  var opp;
  if (steps.xAbs === 2) {
    opp = {};
    opp.x = move.from.x + steps.x / 2;
    opp.y = move.from.y + steps.y / 2;
    opp.tile = this.tiles[opp.x][opp.y];
    if ( (player.color === 'W' && opp.tile !== 'B') ||
         (player.color === 'B' && opp.tile !== 'W') )
          return false;
    return opp;
  }
  return true;
};

Game.prototype.applyMove = function(move, steps, opp, player) {
  var man = this.tiles[move.from.x][move.from.y];
  this.tiles[move.from.x][move.from.y] = 'E';
  this.tiles[move.to.x][move.to.y] = man;

  if (steps.xAbs === 1) {
    this.changeTurn();
    move.changeTurn = true;
  } else if (steps.xAbs === 2) {
    this.tiles[opp.x][opp.y] = 'E';
    if (this.moreMovesAvailable(move.to.x, move.to.y, player.color) > 0) {
      this.lastMoveWasBeat = { x: move.to.x, y: move.to.y, color: player.color };
    } else {
      this.changeTurn();
      move.changeTurn = true;
      this.lastMoveWasBeat = undefined;
    }
    move.manToBeat = { x: opp.x, y: opp.y };
  }

  return move;
};

Game.prototype.moreMovesAvailable = function(x, y, color) {
  var relativePosBeat = [ [-2, -2], [-2, 2], [2, -2], [ 2, 2] ]; //always the same
  var allowed = 0;
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

  return allowed > 0;
};

Game.prototype.canBeat = function(tile, oppTile, color) {
  var res =  this.tiles[tile.x][tile.y] === 'E' &&
    this.tiles[oppTile.x][oppTile.y] === this.oppositeColor(color);

  return res;
};

Game.prototype.oppositeColor = function(color) {
  return (color === 'W' ? 'B' : 'W');
};

Game.prototype.areCoordsValid = function(tile) {
  var res =   (tile.x >= 0 && tile.x < 10 && tile.y >= 0 && tile.y < 10);

  return res;
};

module.exports = Game;
