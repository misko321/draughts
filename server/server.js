var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomstring = require("randomstring");
var Game = require('./game.js');
var Player = require('./player.js');
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

  connect(socket);

  //FIXME: throw everything to separate functions +REFACTOR
  socket.on('join-new-game', function(msg) {
    joinNewGame(socket, msg);
  });

  socket.on('join-existing-game', function(msg) {
    joinExistingGame(socket, msg);
  });

  socket.on('move', function(msg) {
    move(socket, msg);
  });

  //TODO notify the other player if connection with the first one is broken +STD_FEATURE
  socket.on('disconnect', function(msg) {
    disconnect(socket, msg);
  });

});

function connect(socket) {
  console.log('A new User connected');
  socket.emit('connect-ack', {
    status: 'OK',
    message: 'You have successfully connected to the server'
  });
}

function joinNewGame(socket, msg) {
  var game;
  var player = new Player(msg.username, socket);
  socket.player = player;

  if (!someoneWaitsInQueue) {
    lastFreeToken = randomstring.generate();
    game = new Game(lastFreeToken);
    games[lastFreeToken] = game;
    game.join(player);
    someoneWaitsInQueue = true; //I'm waiting
  } else {
    game = games[lastFreeToken];
    game.join(player);
    someoneWaitsInQueue = false;
  }

  socket.join(lastFreeToken);
  socket.emit('join-new-game-ack', {
    status: 'OK',
    message: 'A new game was created',
    token: lastFreeToken,
    tiles: game.tiles
  });

  //if two players joined and game can be started
  if (someoneWaitsInQueue === false) {
    game.start();
    sendSecondPlayerJoins(game.players[0], game.players[1].username);
    sendSecondPlayerJoins(game.players[1], game.players[0].username);
  }

  function sendSecondPlayerJoins(player, opponentUsername) {
    player.socket.emit('second-player-joins', {
      status: 'OK',
      message: 'Your opponent has joined the game',
      color: player.color,
      "username": opponentUsername
    });
  }
}

function joinExistingGame(socket, msg) {
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
}

function move(socket, msg) {
  var game = games[msg.token];
  game.makeMove(msg.move);
  socket.broadcast.to(msg.token).emit('move', {
    status: 'OK',
    move: msg.move
  });
}

function disconnect(socket, msg) {
  //TODO 5 sec timeout +ADD_FEATURE
  socket.broadcast.to(socket.player.game.token).emit('disconnect-issue', null);
  // console.log('disconnect issue, ' + socket + ", " + socket.player.game.token);
  socket.emit('disconnect-ack', {
    status: 'OK',
    message: 'You have been disconnected from the server'
  });
  console.log('user disconnected');
}

http.listen(3000, function() {
  console.log('listening on *:3000');
});
