var Man = function(tile) {
  // this.color = color;
  this.power = Man.ManPower.STANDARD;
  this.tile = tile;

  this.graphic = new fabric.Circle({
    radius: Man.Radius,
    fill: Object.getPrototypeOf(this).constructor.Color,
    left: Tile.size * (tile.x + 0.5) - Man.Radius,
    top: Tile.size * (tile.y +0.5) - Man.Radius,
    selectable: false,
    obj: this
  });

  canvas.add(this.graphic);
};

Man.Radius = undefined;
Man.StrokeWidth = undefined;
Man.board = undefined; //TODO capitalize or not?

Man.ManPower = {
  STANDARD: 0,
  KING: 1
};

Man.ManColor = {
  WHITE: 0,
  BLACK: 1
};

Man.prototype.getColor = function() {
  return undefined;
};

Man.prototype.onMouseOver = function() {
  this.graphic.fill = Color(this.getColor()).lightenByRatio(2).toString();
};

Man.prototype.onMouseOut = function() {
  this.graphic.fill = this.getColor();
};

Man.prototype.select = function() {
  // this.graphic.set('fill', Color(actualColor).lightenByRatio(2).toString());
  Man.board.unselect();
  Man.board.selected = this;
  this.graphic.set({
    strokeWidth: Man.StrokeWidth,
    stroke: this.getColorStroke(),
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius - Man.StrokeWidth / 2,
    top: Tile.size * (this.tile.y +0.5) - Man.Radius - Man.StrokeWidth / 2
  });
};

Man.prototype.unselect = function() {
  Man.board.selected = undefined; //TODO capitalize or not?
  this.graphic.set({
    strokeWidth: 0,
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius,
    top: Tile.size * (this.tile.y +0.5) - Man.Radius
  });
};
