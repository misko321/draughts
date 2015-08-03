var Tile = function (type) {
  this.type = type;
  this.tint = 0;
  this.hover = false;
};

Tile.size = undefined;
Tile.colorAllowed = "#979797";
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
    if (this.hover) {
      actualColor = Color(Tile.colorAllowed).lightenByRatio(0.2).toString();
    }
  }

  GraphicsContext.drawRectangle(0, 0, Tile.size, Tile.size, actualColor);
};
