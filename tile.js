var Tile = function (type) {
  this.type = type;
  this.tint = 0;
};

Tile.TileType = {
  MAN: 0,
  BLANK: 1,
  FORBIDDEN: 2
};

Tile.prototype.draw = function() {
  console.log('sth');
}
