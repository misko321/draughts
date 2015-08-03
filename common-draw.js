var GraphicsContext = function() {
}

GraphicsContext.drawRectangle = function(x, y, width, height, fillStyle) {
  this.setFillStyle(fillStyle);
  ctx.fillRect(x, y, width, height);
}

GraphicsContext.drawCircle = function(x, y, radius, fillStyle) {
  this.setFillStyle(fillStyle);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
}

GraphicsContext.setFillStyle = function(fillStyle) {
  if (fillStyle !== undefined)
    this.ctx.fillStyle = fillStyle;
}

GraphicsContext.setCanvasContext = function(canvasContext) {
  this.ctx = canvasContext;
}
