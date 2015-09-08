var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
//TODO manage all properties in proper files +REFACTOR
var board;
var Color = net.brehaut.Color;
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;
var username;
var turn = "#turnWhiteGlyph";

var socketURL = document.location.origin;

//TODO will 'window.requestAnimationFrame(draw)' ever be needed? +RETHINK
//TODO make clear where's the entire application's entry point +STD_FEATURE
var websocket = new Websocket(socketURL);

function initializeGame(status, tiles) {//}, turn) {
  if (status === "OK") {
    board = new Board(tiles);
    $(".game-not-found-tr").hide();
    $(".game-tr").show();
  } else {
    $(".game-tr").hide();
    $(".game-not-found-tr").show();
  }

  // board.myTurn = (board.myTurn ? false : true);
}

function showModalUsername() {
  $("#usernameInput").val(localStorage.getItem('username'));
  $('#joinGameModal').modal('show');
  setTimeout(function() {
    $("#usernameInput").focus();
  }, 500);
}

function opponentDisconnectIssue() {
  $("#waitingForOtherPlayerModal .modal-title").html("Your opponent has disconnected...");
  $("#modalEnjoy").hide();
  $("#modalWaitSpan").html("It seems that your opponent has some problems with Internet connection <br>" +
    "or has abandoned the game.<br />" +
    "Please, wait a moment until your opponent rejoins the game or find a <a href='/'>new one</a>.");
  $("#modalWait").show();
  $("#waitingForOtherPlayerModal").modal('show');
}

function showWaitingModal() {
  $('#waitingForOtherPlayerModal').modal('show');
}

//TODO rename methods, \@object +REFACTOR
$("#joinGameButton").click(function() {
  joinGame();
});

function joinGame() {
  username = $("#usernameInput").val();
  localStorage.setItem('username', username);
  websocket.connect(username);
  $('#joinGameModal').modal('hide');
  showWaitingModal();
}

function showPlayerJoinedOnModal(opponentUsername, yourColor) {
  var fadeTime = 500;
  var msgTime = 500;

  if (yourColor === "white") {
    $("#turnWhite").html(username);
    $("#turnBlack").html(opponentUsername);
  } else {
    $("#turnBlack").html(username);
    $("#turnWhite").html(opponentUsername);
  }

  $("#opponentUsername").html(opponentUsername);
  $("#yourColor").html(yourColor).addClass("color-" + yourColor);

  $('#modalWait').fadeOut(fadeTime, function() {
    $('#modalEnjoy').fadeIn(fadeTime, function() {
      setTimeout(function() {
        $('#waitingForOtherPlayerModal').modal('hide');
        $('body').css('padding-left', '0 !important');
      }, msgTime);
    });
  });
}

function changeTurn() {
  $(turn).fadeTo(500, 0); //TODO turn +REFACTOR
  turn = (turn === "#turnWhiteGlyph" ? "#turnBlackGlyph" : "#turnWhiteGlyph");
  $(turn).fadeTo(500, 1);

  board.myTurn = (board.myTurn ? false : true);
}

$(document).ready(function() {
  $("#usernameInput").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      joinGame();
    }
  });
  var waitTillMsgTime = 0;
  if (UrlManager.getToken()) {
    // showWaitingModal();
    websocket.connect();
  }
  else
    setTimeout(showModalUsername, waitTillMsgTime);
});

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
