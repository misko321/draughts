/*
  Wrapper for canvas' context
*/
var GraphicsContext = function() {
};

GraphicsContext.drawRectangle = function(x, y, width, height, fillStyle) {
  this.setFillStyle(fillStyle);
  ctx.fillRect(x, y, width, height);
};

GraphicsContext.drawCircle = function(x, y, radius, fillStyle) {
  this.setFillStyle(fillStyle);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
};

GraphicsContext.setFillStyle = function(fillStyle) {
  if (fillStyle !== undefined)
    this.ctx.fillStyle = fillStyle;
};

GraphicsContext.setCanvasContext = function(canvasContext) {
  this.ctx = canvasContext;
};

GraphicsContext.translate = function(x, y) {
  ctx.translate(x, y);
};

GraphicsContext.save = function() {
  ctx.save();
};

GraphicsContext.restore = function() {
  ctx.restore();
};

// FIXME: color.js
GraphicsContext.tint = function(color, factor) {
  var tintedColors = GraphicsContext.splitRGB(color);

  for (var i = 0; i < tintedColor.length; ++i) {
    tintedColors[0] = tintedColors[0] + (255 - tintedColors[0]) * factor;
  }

  return GraphicsContext.joinRGB(tintedColors);
};

GraphicsContext.splitRGB = function(colorsString) {
  return colorsString.substring(color.indexOf('(')+1, color.indexOf(')')).split(',');
};

GraphicsContext.joinRGB = function(colorsArray) {
  return 'rgb(' + colorsArray.join(',') + ')';
};
