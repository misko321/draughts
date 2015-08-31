var Websocket = function() { };

Websocket.emit = function(tileFrom, tileTo) {
  client.emit('move', {
    fromX: tileFrom.x,
    fromY: tileFrom.y,
    toX: tileTo.x,
    toY: tileTo.y
  });
};
