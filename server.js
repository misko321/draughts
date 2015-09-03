var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");
var Game = require('./game.js');
app.use(bodyParser.json());
app.use(bodyParser.text());

var options = {
  root: __dirname
};

app.use(express.static('./public/'));
app.use('/bower_components',  express.static('./bower_components/'));

app.get('/[a-zA-Z0-9]+', function(req, res) {
  res.sendFile('./public/index.html', options);
});
app.get('/*', function(req, res) {
  res.redirect('/');
});

var someoneWaits = false;
var lastFreeToken;
var games = [];

io.on('connection', function(socket) {
  console.log('A new User connected');
  socket.emit('connect-ack', {
    status: 'OK',
    message: 'You have successfully connected to the server'
  });

  //FIXME: throw everything to separate functions +REFACTOR
  socket.on('join-new-game', function() {
    var game;
    if (!someoneWaits) {
      lastFreeToken = randomstring.generate();
      game = new Game(lastFreeToken);
      games[lastFreeToken] = game;
      game.join();
      someoneWaits = true; //I'm waiting
    } else {
      game = games[lastFreeToken];
      game.join();
      someoneWaits = false;
    }
    socket.emit('join-new-game-ack', {
      status: 'OK',
      message: 'A new game was created',
      token: lastFreeToken,
      tiles: game.tiles
    });
  });

  socket.on('join-existing-game', function(msg) {
    var game = games[msg.token];
    if (game) {
      game.rejoin();
      socket.emit('join-existing-game-ack', {
        status: 'OK',
        message: 'You have successfully rejoined the game',
        token: msg.token,
        tiles: game.tiles
      });
    } else {
      socket.emit('join-existing-game-ack', {
        status: 'ERROR',
        message: 'A game with given token does not exist'
      });
    }
  });

  socket.on('move', function(msg) {
    var game = games[msg.token];
    game.makeMove(msg.move);
    io.emit('move', {
      status: 'OK',
      move: msg.move
    });
  });

  socket.on('disconnect', function() {
    socket.emit('disconnect-ack', {
      status: 'OK',
      message: 'You have been disconnected from the server'
    });
    console.log('user disconnected');
  });

  // socket.on('move', function(msg) {
  //   io.emit('move', msg);
  // });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
