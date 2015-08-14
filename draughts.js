var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
var mousePos;
var board;
var Color = net.brehaut.Color; //TODO move to bower

// function draw() {
//   board.draw();
//   // window.requestAnimationFrame(draw);
// }

function run() {
  board = new Board();
  // draw();
}

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left - 1, //exact position is a bit different that the one evaluated here
    y: event.clientY - rect.top - 2
  };
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
// canvas.addEventListener('mousemove', function(event) {
//   mousePos = getMousePos(canvas, event);
//   var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
// }, false);
//
// canvas.addEventListener('mouseout', function(event) {
//   mousePos = undefined;
// }, false);
//
// canvas.addEventListener('click', function(event) {
//   mousePos = getMousePos(canvas, event);
// }, false);

run();

/*
  Każdy tile można podświetlać z osobna, czyli dla każdej płytki musi byc zapisywany stan podswietlenia,
  -> obiekt Tile lub -> lista tilów w Board
*/
