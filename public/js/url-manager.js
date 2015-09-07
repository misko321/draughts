var UrlManager = function() {
  UrlManager.token = undefined;
  UrlManager.color = undefined;
};

UrlManager.getToken = function() {
  var array = window.location.pathname.replace(/\/$/, '').split('/');
  var token = array[array.length-2];
  UrlManager.token = (token === "" ? undefined : token);

  return UrlManager.token;
};

UrlManager.applyUrl = function() {
  //TODO recognize if the URL already has the token set? +ADD_FEATURE
  if (typeof(history.pushState) != "undefined") {
    var obj = {
      title: 'Draughts #' + UrlManager.token + '(' + UrlManager.color + ')',
      url: UrlManager.token + '/' + UrlManager.color
    };
    history.pushState(obj, obj.title, obj.url);
  } else {
    console.error("Your browser does not support HTML5");
  }
};
