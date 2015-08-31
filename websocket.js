var Websocket = function() { };

Websocket.emit = function(fromX, fromY, toX, toY) {
  client.emit('move', {
    fromX: fromX,
    fromY: fromY,
    toX: toX,
    toY: toY
  });
};
