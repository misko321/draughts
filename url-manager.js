var UrlManager = function() {};

UrlManager.getToken = function() {
  return window.location.href.split('/').last();
};

UrlManager.setToken = function(token) {
  //TODO recognize if the URL already has the token set?
  if (typeof(history.pushState) != "undefined") {
    var obj = {
      title: 'Draughts #' + token,
      url: token
    };
    history.pushState(obj, obj.title, obj.url);
  } else {
    console.error("Your browser does not support HTML5");
  }
};
