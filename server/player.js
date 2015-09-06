var Player = function(username, socket) {
  this.socket = socket;
  this.username = username;
  this.color = undefined;
};

module.exports = Player;
