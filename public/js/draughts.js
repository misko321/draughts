var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
//TODO manage all properties in proper files +REFACTOR
var board;
var Color = net.brehaut.Color;
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;

var waitTillMsgTime = 500;
var fadeTime = 500;
var msgTime = 2500;

var localUsername;
var turn = 'white';

var socketURL = document.location.origin;

//TODO will 'window.requestAnimationFrame(draw)' ever be needed? +RETHINK
//TODO make clear where's the entire application's entry point +STD_FEATURE
var websocket = new Websocket(socketURL);

$(document).ready(init);

function init() {
  $("#usernameInput").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      joinGame();
    }
  });
  $("#joinGameButton").click(function() {
    joinGame();
  });

  if (UrlManager.getToken()) { //rejoin -> don't ask for username
    websocket.connect();
  }
  else
    setTimeout(showJoinGameModal, waitTillMsgTime);
}

function initializeGame(status, tiles) {
  if (status === "OK") {
    board = new Board(tiles);
    $(".game-not-found-tr").hide();
    $(".game-tr").show();
  } else {
    $(".game-tr").hide();
    $(".game-not-found-tr").show();

    closeAllModals();
  }
}

function closeAllModals() {
  $('#joinGameModal').modal('hide');
  $('#waitingForOtherPlayerModal').modal('hide');
}

function showJoinGameModal() {
  $("#usernameInput").val(localStorage.getItem('username'));
  $('#joinGameModal').modal('show');
  setTimeout(function() {
    $("#usernameInput").focus();
  }, 500);
}

function showOpponentDisconnectedModal() {
  $("#enjoyModalBody").hide();

  $("#waitingForOtherPlayerModal .modal-title").html("Your opponent has disconnected...");
  $("#waitModalBodySpan")
    .html("It seems that your opponent has some problems with Internet connection <br>" +
    "or has abandoned the game.<br />" +
    "Please, wait a moment until your opponent rejoins the game or find a " +
    "<a href='/'>new one</a>.");

  $("#waitModalBody").show();
  $("#waitingForOtherPlayerModal").modal('show');
}

function showWaitingModal() {
  $('#waitingForOtherPlayerModal').modal('show');
}

//TODO rename methods, \@object +REFACTOR
function joinGame() {
  localUsername = $("#usernameInput").val();
  localStorage.setItem('username', localUsername);
  websocket.connect(localUsername);
  closeAllModals();
  showWaitingModal();
}

function showPlayerJoinedOnModal(opponentUsername, yourColor) {

  if (yourColor === "white") {
    $("#turnWhite").html(localUsername);
    $("#turnBlack").html(opponentUsername);
  } else {
    $("#turnBlack").html(localUsername);
    $("#turnWhite").html(opponentUsername);
  }

  $("#opponentUsername").html(opponentUsername);
  $("#yourColor").html(yourColor).addClass("color-" + yourColor);

  $('#waitModalBody').fadeOut(fadeTime, function() {
    $('#enjoyModalBody').fadeIn(fadeTime, function() {
      setTimeout(function() {
        $('#waitingForOtherPlayerModal').modal('hide');
      }, msgTime);
    });
  });
}

function setTurn(turn_) {
  $('#' + turn).fadeTo(fadeTime, 0);
  turn = turn_;
  $('#' + turn).fadeTo(fadeTime, 1);
}

function changeTurn() {
  var newTurn = (turn === 'white' ? 'black' : 'white');
  setTurn(newTurn);
  board.myTurn = (board.myTurn ? false : true);
}

//TODO DRY +REFACTOR
canvas.on('mouse:over', function(e) {
  if (e.target.obj.onMouseOver) {
    e.target.obj.onMouseOver();
    canvas.renderAll();
  }
});

canvas.on('mouse:out', function(e) {
  if (e.target.obj.onMouseOut) {
    e.target.obj.onMouseOut();
    canvas.renderAll();
  }
});

canvas.on('mouse:down', function(e) {
  if (e.target.obj.onMouseDown) {
    e.target.obj.onMouseDown();
    canvas.renderAll();
  }
});

canvas.on('mouse:up', function(e) {
  if (e.target.obj.select) {
    e.target.obj.select();
    canvas.renderAll();
  }
});
