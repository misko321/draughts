var UrlManager = function() {};

UrlManager.getToken = function() {
  var array = window.location.href.split('/');
  var token = array[array.length-1];
  return token === "" ? undefined : token;
};

UrlManager.setToken = function(token) {
  //TODO recognize if the URL already has the token set? +ADD_FEATURE
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
