var canvas = document.getElementById('draughts-canvas');
var ctx = canvas.getContext('2d');
GraphicsContext.setCanvasContext(ctx);
var mousePos;
var TILES_COUNT = 10;
var tile = canvas.width / 10;
var board;



function draw() {
  board.draw();
  window.requestAnimationFrame(draw);
}

function run() {
  board = new Board();
  draw();
  //window.requestAnimationFrame(draw);
}

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left - 1, //exact position is a bit different that the one evaluated here
    y: event.clientY - rect.top - 2
  };
}

canvas.addEventListener('mousemove', function(event) {
  mousePos = getMousePos(canvas, event);
  var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  console.log(message);
  // window.requestAnimationFrame(draw);
}, false);

function splitRGB(color) {
  return color.substring(color.indexOf('(')+1, color.indexOf(')')).split(',');
}

function tint(color, factor) {
  tintedColor = splitRGB(color);

  for (var i = 0; i < tintedColor.length; ++i) {
    tintedColor[0] = tintedColor[0] + (255 - tintedColor[0]) * factor;
  }
}

run();
//window.requestAnimationFrame(draw);

/*
  Każdy tile można podświetlać z osobna, czyli dla każdej płytki musi byc zapisywany stan podswietlenia,
  -> obiekt Tile lub -> lista tilów w Board
*/
