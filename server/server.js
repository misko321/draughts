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


//URL mappings
app.use('/public', express.static('./public/'));
app.use('/bower_components', express.static('./bower_components/'));

app.get('/', function(req, res) {
  res.sendFile('./public/index.html', options);
});
app.get('/[a-zA-Z0-9]+/:color(black|white)', function(req, res) {
  res.sendFile('./public/index.html', options);
});
app.get('/*', function(req, res) {
  res.redirect('/');
});


//game creation
var tokenRand;
var lastGame;
var games = [];

io.on('connection', function(socket) {

  connect(socket);

  socket.on('join-new-game', function(msg) {
    joinNewGame(socket, msg);
  });

  socket.on('join-existing-game', function(msg) {
    joinExistingGame(socket, msg);
  });

  socket.on('move', function(msg) {
    move(socket, msg);
  });

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

  if (lastGame === undefined || lastGame.hasStarted) {
    tokenRand = randomstring.generate();
    lastGame = game = new Game(tokenRand);
    games[tokenRand] = game;
    game.join(player);
  } else {
    game = games[tokenRand];
    game.join(player);
  }

  socket.join(tokenRand);
  socket.emit('join-new-game-ack', {
    status: 'OK',
    message: 'A new game was created',
    token: tokenRand,
    turn: game.turn === 'W' ? 'white' : 'black',
    tiles: game.tiles
  });

  //if two players joined and game can be started
  if (game.playersCount === 2) {
    sendBothPlayersReady(game);
  }
}

function sendSecondPlayerJoins(player, opponentUsername) {
  player.socket.emit('second-player-joins', {
    status: 'OK',
    message: 'Your opponent has joined the game',
    color: player.color === 'W' ? 'white' : 'black',
    "username": opponentUsername
  });
}

function sendBothPlayersReady(game) {
  if (!game.hasStarted)
    game.start();
  sendSecondPlayerJoins(game.players.white, game.players.black.username);
  sendSecondPlayerJoins(game.players.black, game.players.white.username);
}

function joinExistingGame(socket, msg) {
  var game = games[msg.token];
  if (game) {
    var player = game.rejoin(msg.color);
    if (player === undefined) {
      socket.emit('join-existing-game-ack', {
        status: 'ERROR',
        message: 'Someone already connected with this URL'
      });
      return;
    }
    socket.player = player;
    player.socket = socket;

    socket.join(game.token);
    socket.emit('join-existing-game-ack', {
      status: 'OK',
      message: 'You have successfully rejoined the game',
      token: msg.token,
      "username": player.username,
      color: player.color === 'W' ? 'white' : 'black',
      tiles: game.tiles,
      turn: game.turn === 'W' ? 'white' : 'black'
    });

    if (game.playersCount === 2) {
      sendBothPlayersReady(game);
    }
  } else {
    socket.emit('join-existing-game-ack', {
      status: 'ERROR',
      message: 'A game with given token does not exist'
    });
  }
}

function move(socket, msg) {
  var game = games[msg.token];
  var processedMove = game.makeMove(msg.move, socket.player);
  if (processedMove) {
    socket.broadcast.to(msg.token).emit('move', {
      status: 'OK',
      move: processedMove
    });
  } else {
    console.log('Player ' + socket.player.username + ' tried to perform forbidden move!');
    socket.emit('move', {
      status: 'ERROR',
      msg: 'You\'ve tried to perform disallowed move!'
    });
  }
}

function disconnect(socket, msg) {
  var player = socket.player;
  if (player && player.game) { //if joining completed
    player.game.leave(player);
    socket.broadcast.to(player.game.token).emit('opponent-disconnected', null);
    socket.emit('disconnect-ack', {
      status: 'OK',
      message: 'You have been disconnected from the server'
    });
    console.log('User disconnected from the server (game: ' + player.game.token + ')');
  }
}

http.listen(3000, function() {
  console.log('listening on *:3000');
});
