var ManBlack = function(tile) {
  Man.call(this, tile);
};

ManBlack.Color = '#262626';
ManBlack.ColorStroke = '#e7e7e7';

ManBlack.prototype = Object.create(Man.prototype);
ManBlack.prototype.constructor = ManBlack;

ManBlack.prototype.getColor = function() {
  return ManBlack.Color;
};

ManBlack.prototype.getColorStroke = function() {
  return ManBlack.ColorStroke;
};

// ManBlack.prototype.onMouseOver = function() {
//   this.graphic.fill = Color(ManBlack.Color).lightenByRatio(2).toString();
// };
//
// Man.prototype.onMouseOut = function() {
//   this.graphic.fill = ManBlack.Color;
// };
