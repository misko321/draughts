var Websocket = function(url) {
  this.url = url;
  client = io.connect(url);

  client.on('connect', function(socket) {
    console.log('Trying to connect...');
    client.on('connect-ack', function(msg) {
      console.log('Success: ' + msg.message);
    });

    client.emit('join-new-game', null);
    client.on('join-new-game-ack', function(msg) {
      console.log('Success: ' + msg.message + ', token: ' + msg.token);
      UrlManager.setToken(msg.token);
    });

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
