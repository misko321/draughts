var Man = function (type) {
  this.type = type;
};

Man.ManPower = {
  STANDARD: 0,
  KING: 1
};

Man.ManColor = {
  WHITE: 0,
  BLACK: 1
};

Man.prototype.draw = function() {
  console.log('sth');
}
