var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static('.'));

var waitingForOpponent = true;

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.emit('connect_ack', 'hello');
  var token = randomstring.generate();
  socket.on('disconnect', function() {
    socket.emit('disconnect_ack', 'goodbye');
    console.log('user disconnected');
  });
  socket.on('move', function(msg) {
    io.emit('move', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
