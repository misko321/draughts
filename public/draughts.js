var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
var mousePos;
var board;
var Color = net.brehaut.Color; //TODO move to bower
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;
var socketURL = 'http://localhost:3000';

var websocket = new Websocket(socketURL);

// function draw() {
//   board.draw();
//   // window.requestAnimationFrame(draw);
// }

// function run() {
//   board = new Board();
//   // draw();
// }

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

// run();
