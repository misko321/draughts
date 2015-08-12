var Tile = function (type, x, y) {
  this.type = type;
  this.tint = 0;
  this.hover = false;
  this.selected = false;
  this.x = x;
  this.y = y;

  this.graphic = new fabric.Rect({
    left: Tile.size * x,
    top: Tile.size * y,
    fill: type === Tile.TileType.FORBIDDEN ? Tile.colorForbidden : Tile.colorAllowed,
    width: Tile.size,
    height: Tile.size,
    selectable: false,
    obj: this
  });

  // this.man = type === Tile.TileType;

  // this.graphic.setGradient('fill', {
  //   x1: Tile.size / 2,
  //   y1: 0,
  //   x2: Tile.size / 2,
  //   y2: Tile.size,
  //   colorStops: {
  //     0: '#4a4a4a',
  //     1: '#d4d4d4'
  //   }
  // });

  canvas.add(this.graphic);
};

Tile.size = undefined;
Tile.colorAllowed = "#5d5d5d";
Tile.colorForbidden = "#d9d9d9";

Tile.TileType = {
  ALLOWED: 0,
  FORBIDDEN: 1
};

Tile.prototype.setMan = function(man) {
  this.man = man;
};

// Tile.prototype.draw = function() {
//   var actualColor = Tile.colorForbidden;
//
//   if (this.type !== Tile.TileType.FORBIDDEN) {
//     actualColor = Tile.colorAllowed;
//     if (this.hover)
//       actualColor = Color(actualColor).lightenByRatio(0.1).toString();
//     if (this.selected)
//       actualColor = Color(actualColor).lightenByRatio(0.8).toString();
//   }
//
//   GraphicsContext.drawRectangle(0, 0, Tile.size, Tile.size, actualColor);
// };

// Tile.prototype.onMouseOver = function() {
//   var actualColor = this.type === Tile.TileType.FORBIDDEN ? Tile.colorForbidden : Tile.colorAllowed;
//   this.graphic.fill = Color(actualColor).lightenByAmount(0.1).toString();
// };
//
// Tile.prototype.onMouseOut = function() {
//   var actualColor = this.type === Tile.TileType.FORBIDDEN ? Tile.colorForbidden : Tile.colorAllowed;
//   this.graphic.fill = actualColor;
// };
//
// Tile.prototype.onMouseDown = function() {
//   var actualColor = this.type === Tile.TileType.FORBIDDEN ? Tile.colorForbidden : Tile.colorAllowed;
//   var strokeWidth_ = 2;
//   this.graphic.set('fill', Color(actualColor).lightenByAmount(0.1).toString());
//   this.graphic.set({ width: Tile.size - strokeWidth_, height: Tile.size - strokeWidth_,
//     strokeWidth: 2, stroke: '#171717' });
// };
