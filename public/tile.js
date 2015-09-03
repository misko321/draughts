var Tile = function (type, x, y) {
  this.type = type;
  this.tint = 0;
  this.hover = false;
  this.isAllowed = undefined;
  this.x = x;
  this.y = y;

  this.graphic = new fabric.Rect({
    left: Tile.size * x,
    top: Tile.size * y,
    fill: type === Tile.TileType.NONPLAYABLE ? Tile.colorNonplayable : Tile.colorPlayable,
    width: Tile.size,
    height: Tile.size,
    selectable: false,
    obj: this
  });

  canvas.add(this.graphic);
};

Tile.size = undefined;
Tile.colorPlayable = "#717070";
Tile.colorNonplayable = "#d9d9d9";
Tile.colorAllowed = "#38b321";
Tile.colorMovingToNow = "#b8c153";

Tile.TileType = {
  PLAYABLE: 0,
  NONPLAYABLE: 1
};

Tile.prototype.setMan = function(man) {
  this.man = man;
};

Tile.prototype.clearMan = function() {
  this.man = undefined; //TODO null?
};

Tile.prototype.setAsAllowed = function() {
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, Tile.colorAllowed, colorAnimationTime, {
    onChange: function(val) {
      graphic.setFill(val);
      canvas.renderAll();
    }
  });
  this.isAllowed = true;
};

Tile.prototype.clearHighlights = function() {
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, Tile.colorPlayable, colorAnimationTime, {
    onChange: function(val) {
      graphic.setFill(val);
      canvas.renderAll();
    }
  });
  this.isAllowed = false;
};

Tile.prototype.setAsMovingToNow = function() {
  var graphic = this.graphic;
  fabric.util.animateColor(this.graphic.fill, Tile.colorMovingToNow, colorAnimationTime, {
    onChange: function(val) {
      graphic.setFill(val);
      canvas.renderAll();
    }
  });
};

Tile.prototype.onMouseOver = function() {
  if (this.isAllowed) {
    var graphic = this.graphic;
    fabric.util.animateColor(Tile.colorAllowed, //TODO: colorAllowed/this.fill
      Color(Tile.colorAllowed).lightenByRatio(0.2).toString(), hoverAnimationTime, {
      onChange: function(val) {
        graphic.setFill(val);
        canvas.renderAll();
      }
    });
  }
};

Tile.prototype.onMouseOut = function() {
  if (this.isAllowed) {
    var graphic = this.graphic;
    fabric.util.animateColor(this.graphic.fill, Tile.colorAllowed, hoverAnimationTime, {
      onChange: function(val) {
        graphic.setFill(val);
        canvas.renderAll();
      }
    });
  }
};

Tile.prototype.onMouseDown = function() {
  if (this.isAllowed) {
    //move men to selected (this) tile
    websocket.emit(board.selectedMan.tile, this);
    Tile.board.moveSelectedManTo(this);
  } else {
    //or unselect man, if clicked on empty tile
    Tile.board.unselect();
  }
};
