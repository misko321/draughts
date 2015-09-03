var Websocket = function(url) {
  this.url = url;
  this.client = io.connect(url);

  var ws = this;
  this.client.on('connect', function(socket) {

    ws.connect();
    ws.joinGame();

    ws.client.on('move', function(msg) {
      ws.applyMove(msg);
    });

    //TODO move to disconnect method
    ws.client.on('disconnect-ack', function(msg) {
      ws.disconnectAck(msg);
    });
  });
  // this.client = client;
};

Websocket.prototype.connect = function() {
  console.log('Trying to connect...');
  this.client.on('connect-ack', function(msg) {
    console.log(msg.status + ': ' + msg.message);
  });
};

Websocket.prototype.joinGame = function() {
  var token = UrlManager.getToken();
  if (token === undefined) {
    this.joinNewGame();
  } else {
    this.joinExistingGame(token);
  }
};

Websocket.prototype.joinNewGame = function() {
  this.client.emit('join-new-game', null);
  this.client.on('join-new-game-ack', function(msg) {
    console.log(msg.status + ': ' + msg.message + ', token: ' + msg.token);
    board = new Board(msg.tiles);
    UrlManager.setToken(msg.token);
    initializeBoard(msg.status, msg.tiles);
  });
};

Websocket.prototype.joinExistingGame = function(token) {
  this.client.emit('join-existing-game', {
    token: token
  });
  this.client.on('join-existing-game-ack', function(msg) {
    //TODO Logger class?
    console.log(msg.status + ": " + msg.message + ', token: ' + msg.token);
    initializeBoard(msg.status, msg.tiles);
  });
};

Websocket.prototype.disconnect = function (msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.disconnectAck = function (msg) {
  console.log('Success: ' + msg.message);
};

Websocket.prototype.applyMove = function(msg) {
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
