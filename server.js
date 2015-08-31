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
  socket.emit('connect-ack', {
    status: 'OK',
    message: 'You have successfully connected to the server'
  });

  //FIXME: throw everything to separate functions
  socket.on('join-new-game', function() {
    if (!someoneWaits) {
      lastFreeToken = randomstring.generate();
      var game = new Game(lastFreeToken);
      games[lastFreeToken] = game;
      game.join();
      console.log(games);
      someoneWaits = true; //I'm waiting
    } else {
      games[lastFreeToken].join();
      someoneWaits = false;
      lastFreeToken = undefined;
    }
    socket.emit('join-new-game-ack', {
      status: 'OK',
      message: 'A new game was created',
      token: lastFreeToken
    });
  });

  socket.on('join-existing-game', function(msg) {
    var game = games[msg.token];
    if (game) {
      game.rejoin();
      socket.emit('join-existing-game-ack', {
        status: 'OK',
        message: 'You have successfully rejoined the game',
        token: msg.token
      });
    } else {
      socket.emit('join-existing-game-ack', {
        status: 'ERROR',
        message: 'A game with given token does not exist'
      });
      console.log(games);
    }
  });

  socket.on('disconnect', function() {
    socket.emit('disconnect-ack', {
      status: 'OK',
      message: 'You have been disconnected from the server'
    });
    console.log('user disconnected');
  });

  socket.on('move', function(msg) {
    io.emit('move', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
