# draughts

#### TODO:

+ draw objects with gradient
+ unhover objects when mouse leaves canvas
+ ~~Polymer GUI~~
+ Take care of Socket.io automatic reconnection
+ How to handle multistep moves in WebSocket?
+ Private matches
+ Highlight possible moves (the best moves)
+ Allow spectating for other players
+ If one player make more than 1 move, the other player sees it as one
+ Cancel joining a new game?
+ html -> aria, role
+ i18n
+ Show if one of the player disconnects & connects again (5 sec timeout?) +STD_FEATURE
+ Show message if 2 players already connected to a game*/join as spectator +STD_FEATURE
+ rotate canvas for black? +ADD_FEATURE
+ glyphicons with turns at half screen
+ socket.io show when problem with connection, server is down

#### TODO:
+ moves validity is checked server-side, send error if move disallowed, only to console +STD_FEATURE
+ taking turns server-side, beating server-side
+ store whose turn it is server-side


make move [tylko w przód lub jeśli bicie to w tył]
if (move is bicie) {
  zbij();
  while (can bić)
    next move, ale tylko ten z biciem [w przód lub w tył], tylko tym samym pionkiem, nie można
    go odselectować
}
finish move
