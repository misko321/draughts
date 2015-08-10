var Tile = function (type) {
  this.type = type;
  this.tint = 0;
  this.hover = false;
  this.selected = false;
};

Tile.size = undefined;
Tile.colorAllowed = "#5d5d5d";
Tile.colorForbidden = "#d9d9d9";

Tile.TileType = {
  MAN: 0,
  BLANK: 1,
  FORBIDDEN: 2
};

Tile.prototype.draw = function() {
  var actualColor = Tile.colorForbidden;

  if (this.type !== Tile.TileType.FORBIDDEN) {
    actualColor = Tile.colorAllowed;
    if (this.hover)
      actualColor = Color(actualColor).lightenByRatio(0.1).toString();
    if (this.selected)
      actualColor = Color(actualColor).lightenByRatio(0.8).toString();
  }

  GraphicsContext.drawRectangle(0, 0, Tile.size, Tile.size, actualColor);
};
