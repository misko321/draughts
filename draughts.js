var canvas = document.getElementById('draughts-canvas');
var ctx = canvas.getContext('2d');
var mousePos;
var TILES_COUNT = 10;
var tile = canvas.width / 10;
var board;

var Board = function () {
  this.tiles = [];

  for (var i = 0; i < TILES_COUNT; ++i) {
    this.tiles[i] = [];
    for (var j = 0; j < TILES_COUNT / 2; ++j) {
      if (i < 4)
        this.tiles[i][j] = Board.TileType.BLACK;
      else if (i < 6)
        this.tiles[i][j] = Board.TileType.BLANK;
      else
        this.tiles[i][j] = Board.TileType.WHITE;
    }
  }
};

Board.TileType = {
  WHITE: 0,
  BLACK: 1,
  BLANK: 2
};

Board.prototype.draw = function() {
  this.clear();
  this.drawBoardBase();
  this.drawMen();
  if (mousePos) {
    ctx.fillStyle = "#f5f5f5";
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  // window.requestAnimationFrame(this.draw)
}

Board.prototype.clear = function() {
  ctx.fillStyle = "#d9d9d9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#979797";
}

Board.prototype.drawBoardBase = function() {
  for (var i = 0; i < 5; ++i) {
    for (var j = 0; j < 5; ++j) {
      ctx.fillRect(tile*(2*j+1), tile*(2*i), canvas.width / 10, canvas.height / 10);
      ctx.fillRect(tile*(2*j), tile*(2*i+1), canvas.width / 10, canvas.height / 10);
    }
  }
}

Board.prototype.drawMen = function() {
  for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 5; ++j) {
      switch (this.tiles[i][j]) {
        case Board.TileType.BLACK:
          ctx.fillStyle = "#2c2c2c";
          ctx.beginPath();
          ctx.arc(2*j*tile + 0.5*tile + (1-i%2)*tile, i*tile + 0.5*tile, 13, 0, 2 * Math.PI, false);
          ctx.fill();
          break;
        case Board.TileType.WHITE:
          ctx.fillStyle = "#f0f0f0";
          ctx.beginPath();
          ctx.arc(2*j*tile + 0.5*tile + (1-i%2)*tile, i*tile + 0.5*tile, 13, 0, 2 * Math.PI, false);
          ctx.fill();
          break;
        }
    }
  }
}

function draw() {
  board.draw();
}

function run() {
  board = new Board();
  draw();
  window.requestAnimationFrame(draw);
}

function getMousePos(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
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

/*
  Tile jako lista? -> kiepskie wyszukiwanie czy można bić
*/
