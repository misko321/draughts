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
  root: __dirname + "/../"
};

app.use(express.static('./public/'));
app.use('/bower_components',  express.static('./bower_components/'));

app.get('/[a-zA-Z0-9]+', function(req, res) {
  res.sendFile('./public/index.html', options);
});
app.get('/*', function(req, res) {
  res.redirect('/');
});

var someoneWaitsInQueue = false;
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
    if (!someoneWaitsInQueue) {
      lastFreeToken = randomstring.generate();
      game = new Game(lastFreeToken);
      games[lastFreeToken] = game;
      game.join();
      someoneWaitsInQueue = true; //I'm waiting
    } else {
      game = games[lastFreeToken];
      game.join();
      someoneWaitsInQueue = false;
    }
    socket.emit('join-new-game-ack', {
      status: 'OK',
      message: 'A new game was created',
      token: lastFreeToken,
      tiles: game.tiles
    });

    if (someoneWaitsInQueue === false) {
      io.emit('second-player-joins', {
        status: 'OK',
        message: 'Your opponent has joined the game',
      });
    }
  });

  socket.on('join-existing-game', function(msg) {
    var game = games[msg.token];
    if (game) {
      var playersCount = game.rejoin(); //TODO would be more reliable if white/blackPresent was used +RETHINK
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

  //TODO notify the other player if connection with the first one is broken +STD_FEATURE
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
