var canvas = new fabric.Canvas('draughts-canvas');
canvas.setBackgroundColor("#ffffff");
//TODO manage all properties in proper files +REFACTOR
var board;
var Color = net.brehaut.Color;
var hoverAnimationTime = 100;
var colorAnimationTime = 300;
var manAnimationTime = 700;

var socketURL = document.location.origin;

//TODO will 'window.requestAnimationFrame(draw)' ever be needed? +RETHINK
//TODO make clear where's the entire application's entry point +STD_FEATURE
var websocket = new Websocket(socketURL);

function initializeGame(status, tiles) {
  if (status === "OK") {
    board = new Board(tiles);
    $(".game-not-found-tr").hide();
    $(".game-tr").show();
  } else {
    $(".game-tr").hide();
    $(".game-not-found-tr").show();
  }
}

function showModalUsername() {
  $('#joinGameModal').modal('show');
}

function showModal() {
  $('#waitingForOtherPlayerModal').modal('show');
}

//TODO rename methods, @object +REFACTOR
$("#joinGameButton").click(function() {
  websocket.connect($("#usernameInput").val());
  $('#joinGameModal').modal('hide');
  showModal();
});
// setTimeout(showPlayerJoinedOnModal, 2000);

function showPlayerJoinedOnModal(username, color) {
  var fadeTime = 500;
  var msgTime = 2500;

  $("#opponentUsername").html(username);
  $("#yourColor").html(color).addClass("color-" + color);

  $('#modalWait').fadeOut(fadeTime, function() {
    $('#modalEnjoy').fadeIn(fadeTime, function() {
      setTimeout(function() {
        $('#waitingForOtherPlayerModal').modal('hide');
      }, msgTime);
    });
  });
}

//TODO don't show when game doesn't exist +STD_FEATURE
$(document).ready(function() {
  $("#usernameInput").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      websocket.connect($("#usernameInput").val());
      $('#joinGameModal').modal('hide');
      showModal();
    }
  });
  var waitTillMsgTime = 1000;
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
