var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
//TODO manage all properties in proper files +REFACTOR
var board;
var Color = net.brehaut.Color;
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;

var socketURL = document.location.origin;

//TODO will 'window.requestAnimationFrame(draw)' ever be needed? +RETHINK
//TODO make clear where's the entire application's entry point +STD_FEATURE
var websocket = new Websocket(socketURL);
function initializeGame(status, tiles) {
  if (status === "OK") {
    board = new Board(tiles);
    $(".game-not-found-tr").hide();
    $(".game-tr").show();
  } else {
    $(".game-tr").hide();
    $(".game-not-found-tr").show();
  }
}

//TODO DRY +REFACTOR
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
