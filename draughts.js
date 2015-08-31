var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
var mousePos;
var board;
var Color = net.brehaut.Color; //TODO move to bower
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;
var socketURL = 'http://localhost:3000';

var client = io.connect(socketURL);

client.on('connect', function(socket) {
  console.log('Trying to connect...');
  client.on('connect-ack', function(msg) {
    console.log('Success: ' + msg.message);
  });

  client.emit('join-game', null);
  client.on('join-game-ack', function(msg) {
    console.log('Success: ' + msg.message);
  });

  client.on('disconnect-ack', function(msg) {
    console.log('Success: ' + msg.message);
  });

  client.on('move', function(msg) {
    console.log(msg);
  });
});

// function draw() {
//   board.draw();
//   // window.requestAnimationFrame(draw);
// }

function run() {
  board = new Board();
  // draw();
}

canvas.on('mouse:over', function(e) {
  if (e.target.obj.onMouseOver) {
    e.target.obj.onMouseOver();
    canvas.renderAll();
  }
});

canvas.on('mouse:out', function(e) {
  if (e.target.obj.onMouseOut) {
    e.target.obj.onMouseOut();
    canvas.renderAll();
  }
});

canvas.on('mouse:down', function(e) {
  if (e.target.obj.onMouseDown) {
    e.target.obj.onMouseDown();
    canvas.renderAll();
  }
});

canvas.on('mouse:up', function(e) {
  if (e.target.obj.select) {
    e.target.obj.select();
    canvas.renderAll();
  }
});
// canvas.onMouseOut = function() {
//   console.log('mouseOut');
// };

run();
