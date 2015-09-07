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

#### TODO:
+ Show message if 2 players already connected to a game*/join as spectator +STD_FEATURE
+ Show if one of the player disconnects & connects again (5 sec timeout?) +STD_FEATURE
+ Save username and color, so it's still there after reconnecting +STD_FEATURE
+ first player joins and leaves, server state should reset -> player gets out of queue +STD_FEATURE
+ moves validity is checked server-side +STD_FEATURE
+ Change GUI, show whose turn it is, which color is user's, name of the opponent +STD_FEATURE
+ rotate canvas for black? +ADD_FEATURE
+ user enters name only once +STD_FEATURE
+ game is considered started only with both url parts
