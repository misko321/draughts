var Websocket = function(url) {
  this.url = url;
};

Websocket.prototype.connect = function(gameUsername) {
  this.gameUsername = gameUsername;
  this.client = io.connect(this.url);

  var that = this;
  this.client.on('connect', function(socket) {

    that.connectToServer();
    that.joinGame();

    that.client.on('move', function(msg) {
      that.applyMove(msg);
    });

    that.client.on('disconnect-issue', function(msg) {
      that.disconnectIssue(msg);
    });

    //TODO move to disconnect method +RETHINK
    that.client.on('disconnect-ack', function(msg) {
      that.disconnectAck(msg);
    });

    that.client.on('second-player-joins', function(msg) {
      console.log('second-player-joins');
      if (board.playerColor === undefined) //false if opponent reconnected
        board.setPlayerColor(msg.color);
      showPlayerJoinedOnModal(msg.username, msg.color);
      UrlManager.color = msg.color;
      UrlManager.applyUrl();
    });
  });
};

Websocket.prototype.connectToServer = function() {
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
    "username": this.gameUsername
  });
  this.client.on('join-new-game-ack', function(msg) {
    console.log(msg.status + ': ' + msg.message + ', token: ' + msg.token);
    board = new Board(msg.tiles);
    UrlManager.token = msg.token;
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
    initializeGame(msg.status, msg.tiles);
    that.gameUsername = msg.username; //TODO username spaghetti +REFACTOR
    username = msg.username;
    if (msg.status === "OK")
      showWaitingModal();
    // if (board.playerColor === undefined) //false if opponent reconnected
    // board.setPlayerColor(msg.color);
    // showPlayerJoinedOnModal(msg.username, msg.color);
  });
};

Websocket.prototype.disconnectIssue = function(msg) {
  console.log('disconnect issue');
  opponentDisconnectIssue();
};

Websocket.prototype.disconnect = function(msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.disconnectAck = function(msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.applyMove = function(msg) {
  //TODO don't perform action if it came out of this host +RETHINK +STD_FEATURE
  board.moveMan(msg.move.fromX, msg.move.fromY, msg.move.toX, msg.move.toY);
  if (msg.changeTurn)
    changeTurn();
  console.log('move');
};

Websocket.prototype.emit = function(tileFrom, tileTo) {
  this.client.emit('move', {
    token: UrlManager.getToken(),
    move: {
      fromX: tileFrom.x,
      fromY: tileFrom.y,
      toX: tileTo.x,
      toY: tileTo.y
    }
  });
};
