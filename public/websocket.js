var Websocket = function(url) {
  this.url = url;
  client = io.connect(url);

  client.on('connect', function(socket) {
    console.log('Trying to connect...');
    client.on('connect-ack', function(msg) {
      console.log('Success: ' + msg.message);
    });

    var token = UrlManager.getToken();
    if (token === undefined) {
      client.emit('join-new-game', null);
      client.on('join-new-game-ack', function(msg) {
        console.log('Success: ' + msg.message + ', token: ' + msg.token);
        board = new Board(msg.tiles);
        UrlManager.setToken(msg.token);
      });
    } else {
      client.emit('join-existing-game', { token: token });
      client.on('join-existing-game-ack', function(msg) {
        //TODO Logger class?
        console.log(msg.status + ": " + msg.message + ', token: ' + msg.token);
        if (msg.status === "OK")
          board = new Board(msg.tiles);
      });
    }

    client.on('disconnect-ack', function(msg) {
      console.log('Success: ' + msg.message);
    });

    client.on('move', function(msg) {
      console.log(msg);
    });
  });

  this.client = client;
};

Websocket.prototype.emit = function(tileFrom, tileTo) {
  this.client.emit('move', {
    fromX: tileFrom.x,
    fromY: tileFrom.y,
    toX: tileTo.x,
    toY: tileTo.y
  });
};
