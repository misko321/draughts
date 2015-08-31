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

Tile.prototype.setAsAllowed = function() {
  // this.graphic.set({
  //   fill: Tile.colorAllowed
  // });
  //TODO Extract common animation methods to other file? What about closures parameters?
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
  // this.graphic.set({
  //   fill: this.type === Tile.TileType.NONPLAYABLE ? Tile.colorNonplayable : Tile.colorPlayable
  // });
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
  // this.graphic.fill = Tile.colorMovingToNow;
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
    // this.graphic.fill = Color(this.graphic.getFill()).lightenByRatio(0.2).toString();
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
    // this.graphic.setFill(Tile.colorAllowed); //FIXME setFill or fill everywhere
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
  // console.log('tile onMouseDown');
  if (this.isAllowed) {
    //move men to selected (this) tile
    Websocket.emit(board.selectedMan.tile.x, board.selectedMan.tile.y, this.x, this.y);
    Tile.board.moveSelectedManTo(this);
  } else {
    //or unselect man, if clicked on empty tile
    Tile.board.unselect();
  }
};

// Tile.prototype.draw = function() {
//   var actualColor = Tile.colorNonplayable;
//
//   if (this.type !== Tile.TileType.NONPLAYABLE) {
//     actualColor = Tile.colorPlayable;
//     if (this.hover)
//       actualColor = Color(actualColor).lightenByRatio(0.1).toString();
//     if (this.selectedMan)
//       actualColor = Color(actualColor).lightenByRatio(0.8).toString();
//   }
//
//   GraphicsContext.drawRectangle(0, 0, Tile.size, Tile.size, actualColor);
// };

// Tile.prototype.onMouseOver = function() {
//   var actualColor = this.type === Tile.TileType.NONPLAYABLE ? Tile.colorNonplayable : Tile.colorPlayable;
//   this.graphic.fill = Color(actualColor).lightenByAmount(0.1).toString();
// };
//
// Tile.prototype.onMouseOut = function() {
//   var actualColor = this.type === Tile.TileType.NONPLAYABLE ? Tile.colorNonplayable : Tile.colorPlayable;
//   this.graphic.fill = actualColor;
// };
//
