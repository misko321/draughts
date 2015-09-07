var Man = function(tile) {
  this.power = Man.ManPower.STANDARD;
  this.tile = tile;

  this.graphic = new fabric.Circle({
    radius: Man.Radius,
    fill: Object.getPrototypeOf(this).constructor.Color,
    left: Tile.size * (tile.x + 0.5) - Man.Radius, //TODO originX, originY +REFACTOR
    top: Tile.size * (tile.y + 0.5) - Man.Radius,
    selectable: false,
    obj: this
  });

  canvas.add(this.graphic);
};

Man.Radius = undefined;
Man.StrokeWidth = undefined; //TODO capitalize or not? +REFACTOR
Man.board = undefined; //TODO capitalize or not? +REFACTOR

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

Man.prototype.disableSelectable = function() {
  this.onMouseOver = null;
  this.onMouseOut = null;
  this.onMouseDown = null;
  this.select = null;
};

Man.prototype.onMouseOver = function() {
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
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, this.getColor(), hoverAnimationTime, {
    onChange: function(val) {
      graphic.setFill(val);
      canvas.renderAll();
    }
  });
};

Man.prototype.select = function() {
  //if already selected, don't play animation
  if (!Man.board.myMove || Man.board.selectedMan === this)
    return;

  Man.board.select(this);
  this.graphic.set({
    stroke: this.getColorStroke(),
  });
  this.graphic.animate({
    strokeWidth: Man.StrokeWidth,
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius - Man.StrokeWidth / 2,
    top: Tile.size * (this.tile.y + 0.5) - Man.Radius - Man.StrokeWidth / 2
  }, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeInSine
  });
};

Man.prototype.unselect = function() {
  this.graphic.animate({
    strokeWidth: 0,
    left: Tile.size * (this.tile.x + 0.5) - Man.Radius,
    top: Tile.size * (this.tile.y + 0.5) - Man.Radius
  }, {
    onChange: canvas.renderAll.bind(canvas),
    duration: 500,
    easing: fabric.util.ease.easeOutExpo
  });
};

//TODO isSelected as a parameter or Man's property? +RETHINK +REFACTOR
Man.prototype.moveToTile = function(tileTo, isSelected) {
  this.moveToTileAnimation(tileTo, isSelected);
  this.moveToTileLogic(tileTo);
};

Man.prototype.moveToTileAnimation = function(tileTo, isSelected) {
  //due to drawing order some men might end up hidden beneath tiles
  canvas.bringToFront(this.graphic);
  //TODO change object center? +REFACTOR +MINOR
  this.graphic.animate({
    left: Tile.size * (tileTo.x + 0.5) - Man.Radius - (isSelected ? Man.StrokeWidth / 2 : 0),
    top: Tile.size * (tileTo.y + 0.5) - Man.Radius - (isSelected ? Man.StrokeWidth / 2 : 0)
  }, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: function() {
      if (isSelected) {
        Tile.board.onMoveCompleted(tileTo);
        canvas.renderAll();
      }
    },
    duration: manAnimationTime,
    easing: fabric.util.ease.easeInOutQuad
  });
  this.graphic.setCoords(); //required by Fabric.js after programmatic move of object
};

Man.prototype.moveToTileLogic = function(tileTo) {
  this.tile.clearMan(); //clear man from previous tile
  tileTo.setMan(this); //set man at new tile
  this.tile = tileTo;
};
