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
  // this.graphic.fill = Color(this.getColor()).lightenByRatio(1).toString();
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, Color(this.getColor()).lightenByRatio(1).toString(),
    hoverAnimationTime, {
      onChange: function(val) {
        graphic.setFill(val);
        canvas.renderAll();
      }
    });
};

Man.prototype.onMouseOut = function() {
  // this.graphic.fill = this.getColor();
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, this.getColor(), hoverAnimationTime, {
    onChange: function(val) {
      graphic.setFill(val);
      canvas.renderAll();
    }
  });
};

Man.prototype.select = function() {
  // this.graphic.set('fill', Color(actualColor).lightenByRatio(2).toString());

  //if already selected, don't play animation
  if (Man.board.selectedMan === this)
    return;

  Man.board.select(this);
  this.graphic.set({
    stroke: this.getColorStroke(),
    // strokeWidth: Man.StrokeWidth / 2
  });
  this.graphic.animate({
    strokeWidth: Man.StrokeWidth,
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius - Man.StrokeWidth / 2,
    top: Tile.size * (this.tile.y +0.5) - Man.Radius - Man.StrokeWidth / 2
  }, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeInSine
  });
};

Man.prototype.unselect = function() {
  // Man.board.selectedMan = undefined; //TODO capitalize or not?
  // Man.board.unselect();
  // this.graphic.set({
  //   strokeWidth: 0,
  //   left: Tile.size * (this.tile.x + 0.5) - Man.Radius,
  //   top: Tile.size * (this.tile.y +0.5) - Man.Radius
  // });
  this.graphic.animate({
    strokeWidth: 0,
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius,
    top: Tile.size * (this.tile.y +0.5) - Man.Radius
  }, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 500,
    easing: fabric.util.ease.easeOutExpo
  });
};

Man.prototype.moveToTile = function(tile) {
  canvas.bringToFront(this.graphic);
  this.graphic.animate({
    left: Tile.size * (tile.x + 0.5) - Man.Radius - Man.StrokeWidth / 2,
    top: Tile.size * (tile.y + 0.5) - Man.Radius - Man.StrokeWidth / 2
  }, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: function() {
      Tile.board.onMoveCompleted(tile);
      canvas.renderAll();
    },
    duration: manAnimationTime,
    easing: fabric.util.ease.easeInOutQuad
  });
  // this.graphic.set({
  //   left: Tile.size * (tile.x + 0.5) - Man.Radius - Man.StrokeWidth / 2,
  //   top: Tile.size * (tile.y + 0.5) - Man.Radius - Man.StrokeWidth / 2
  // });
  this.graphic.setCoords();
  // canvas.renderAll();

  // this.tile = tile; //FIXME
};
