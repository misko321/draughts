var canvas = document.getElementById('draughts-canvas');
var ctx = canvas.getContext('2d');
GraphicsContext.setCanvasContext(ctx);
var mousePos;
var board;
var Color = net.brehaut.Color;
var previousX;
var previousY;

function draw() {
  if (previousX) {
    board.tiles[previousX][previousY].hover = false;
  }

  // TODO: here or in Board/somewhere else?
  if (mousePos) {
    var xTileHover = Math.floor((mousePos.x - 1) / Tile.size); // FIXME: not "-1", fails when pos === 0
    var yTileHover = Math.floor((mousePos.y - 1) / Tile.size);
    // console.log(xTileHover);
    // console.log(yTileHover);
    board.tiles[xTileHover][yTileHover].hover = true;
    previousX = xTileHover;
    previousY = yTileHover;
  }
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
  // console.log(message);
  // window.requestAnimationFrame(draw);
}, false);

canvas.addEventListener('mouseout', function(event) {
  mousePos = undefined;
  // console.log(message);
  // window.requestAnimationFrame(draw);
}, false);

canvas.addEventListener('click', function(event) {
  mousePos = getMousePos(canvas, event);
  var xTileHover = Math.floor((mousePos.x - 1) / Tile.size); // FIXME: not "-1"
  var yTileHover = Math.floor((mousePos.y - 1) / Tile.size);
  board.tiles[xTileHover][yTileHover].selected = true;
  // console.log(message);
  // window.requestAnimationFrame(draw);
}, false);

run();
//window.requestAnimationFrame(draw);

/*
  Każdy tile można podświetlać z osobna, czyli dla każdej płytki musi byc zapisywany stan podswietlenia,
  -> obiekt Tile lub -> lista tilów w Board
*/
