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
