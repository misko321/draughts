var Man = function(color, tile) {
  this.color = color;
  this.power = Man.ManPower.STANDARD;

  var radius_ = 15;
  this.graphic = new fabric.Circle({
    radius: radius_,
    fill: color === Man.ManColor.BLACK ? Man.ColorBlack : Man.ColorWhite,
    left: Tile.size * (tile.x + 0.5) - radius_,
    top: Tile.size * (tile.y +0.5) - radius_,
    selectable: false,
    obj: this
  });

  canvas.add(this.graphic);
};

Man.ColorBlack = '#262626';
Man.ColorWhite = '#d0d0d0';

Man.ManPower = {
  STANDARD: 0,
  KING: 1
};

Man.ManColor = {
  WHITE: 0,
  BLACK: 1
};

Man.prototype.onMouseOver = function() {
  var actualColor = this.color === Man.ManColor.BLACK ? Man.ColorBlack : Man.ColorWhite;
  this.graphic.fill = Color(actualColor).lightenByRatio(2).toString();
};

Man.prototype.onMouseOut = function() {
  var actualColor = this.color === Man.ManColor.BLACK ? Man.ColorBlack : Man.ColorWhite;
  this.graphic.fill = actualColor;
};

// Man.prototype.onMouseDown = function() {
//   var actualColor = this.color === Man.ManColor.BLACK ? Tile.colorForbidden : Tile.colorAllowed;
//   var strokeWidth_ = 2;
//   this.graphic.set('fill', Color(actualColor).lightenByAmount(0.1).toString());
//   this.graphic.set({ width: Tile.size - strokeWidth_, height: Tile.size - strokeWidth_,
//     strokeWidth: 2, stroke: '#171717' });
// };
