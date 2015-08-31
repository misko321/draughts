var Game = function(token) {
  this.token = token;
  this.playersCount = 0;
};

Game.prototype.join = function() {
  ++this.playersCount;
};

Game.prototype.rejoin = function() {};

module.exports = Game;
