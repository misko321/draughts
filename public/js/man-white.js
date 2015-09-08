var ManWhite = function(tile) {
  Man.call(this, tile);

  this.Color = Man.ManColor.WHITE;
};

ManWhite.Color = '#dfdcdc';
ManWhite.ColorStroke = '#222222';

ManWhite.prototype = Object.create(Man.prototype);
ManWhite.prototype.constructor = ManWhite;

ManWhite.prototype.getColor = function() {
  return ManWhite.Color;
};

ManWhite.prototype.getColorStroke = function() {
  return ManWhite.ColorStroke;
};
