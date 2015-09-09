var Websocket = function(url) {
  this.url = url;
};

Websocket.prototype.connect = function(gameUsername) {
  this.client = io.connect(this.url);

  var that = this;
  this.client.on('connect', function(socket) {

    that.finishConnecting();
    that.joinGame();

    that.client.on('move', function(msg) {
      that.applyMoveFromOpponent(msg.move);
    });

    that.client.on('opponent-disconnected', function() {
      that.opponentDisconnected();
    });

    //in case of manual disconnecting
    that.client.on('disconnect-ack', function(msg) {
      that.disconnectAck(msg);
    });

    that.client.on('second-player-joins', function(msg) {
      console.log('second-player-joins');
      if (board.playerColor === undefined) //don't needed if it's just the opponent who reconnected
        board.setPlayerColor(msg.color, this.turn);
      showPlayerJoinedOnModal(msg.username, msg.color);
      UrlManager.color = msg.color;
      UrlManager.applyUrl();
    });
  });
};

Websocket.prototype.finishConnecting = function() {
  var that = this;
  console.log('Trying to connect...');
  this.client.on('connect-ack', function(msg) {
    console.log(msg.status + ': ' + msg.message);
  });
};

Websocket.prototype.joinGame = function() {
  var token = UrlManager.getToken();
  var color = UrlManager.getColor();
  if (token === undefined)
    this.joinNewGame();
  else
    this.joinExistingGame(token, color);
};

Websocket.prototype.joinNewGame = function() {
  this.client.emit('join-new-game', {
    "username": localUsername
  });
  this.client.on('join-new-game-ack', function(msg) {
    console.log(msg.status + ': ' + msg.message + ', token: ' + msg.token);
    board = new Board(msg.tiles);
    UrlManager.token = msg.token;
    this.turn = msg.turn;
    initializeGame(msg.status, msg.tiles);
  });
};

Websocket.prototype.joinExistingGame = function(token, color) {
  var that = this;
  this.client.emit('join-existing-game', {
    token: token,
    color: color
  });
  this.client.on('join-existing-game-ack', function(msg) {
    //TODO Logger class? +ADD_FEATURE
    console.log(msg.status + ": " + msg.message + ', token: ' + msg.token);
    initializeGame(msg.status, msg.tiles);//, msg.turn);
    localUsername = msg.username;
    this.turn = msg.turn;
    if (msg.status === "OK")
      showWaitingModal();
  });
};

Websocket.prototype.opponentDisconnected = function() {
  console.log('Your opponent has disconnected from the game');
  showOpponentDisconnectedModal();
};

Websocket.prototype.disconnect = function(msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.disconnectAck = function(msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.applyMoveFromOpponent = function(move) {
  //TODO don't perform action if it came out of this host +RETHINK +STD_FEATURE
  console.log('Received move from opponent: ', move);
  var manToBeat = move.manToBeat ? { x: move.manToBeat.x, y: move.manToBeat.y } : undefined;
  board.moveOpponentsMan({ x: move.from.x, y: move.from.y}, { x: move.to.x, y: move.to.y }, manToBeat);
  if (move.changeTurn) {
    console.log('Changing turn...');
    changeTurn();
  }
};

Websocket.prototype.sendMove = function(from, to) {
  var yourMove = {
    'from': { x: from.x, y: from.y },
    'to': { x: to.x, y: to.y }
  };

  console.log('Sending move to your opponent:', yourMove);
  this.client.emit('move', {
    token: UrlManager.getToken(),
    move: yourMove
  });
};
