var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");
var Game = require('./game.js');
app.use(bodyParser.json());
app.use(bodyParser.text());


app.use(express.static('.'));

var someoneWaits = false;
var lastFreeToken;
var games = [];

io.on('connection', function(socket) {
  console.log('A new User connected');
  socket.emit('connect-ack', { status: 'OK', message: 'You have successfully connected to the server.' });

  //FIXME: throw everything to separate functions
  socket.on('join-game', function() {
    if (!someoneWaits) {
      lastFreeToken = randomstring.generate();
      games[lastFreeToken] = new Game(lastFreeToken);
      games[lastFreeToken].join();
      console.log(games);
      someoneWaits = true; //I'm waiting
    } else {
      games[lastFreeToken].join();
      someoneWaits = false;
    }
    socket.emit('join-game-ack', { status: 'OK', message: 'A new game created with token: ' + lastFreeToken + '.' });
  });

  socket.on('disconnect', function() {
    socket.emit('disconnect-ack', { status: 'OK', message: 'You have been disconnected from the server.'});
    console.log('user disconnected');
  });

  socket.on('move', function(msg) {
    io.emit('move', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
