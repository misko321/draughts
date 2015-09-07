var UrlManager = function() {
  UrlManager.token = undefined;
  UrlManager.color = undefined;
};

UrlManager.getToken = function() {
  var array = window.location.pathname.replace(/\/$/, '').split('/');
  var token = array[array.length-2];
  token = (token === "" ? undefined : token);

  return token;
};

UrlManager.getColor = function() {
  var array = window.location.pathname.replace(/\/$/, '').split('/');
  var color = array[array.length-1];
  color = (color === "" ? undefined : color);

  return color;
};

UrlManager.applyUrl = function() {
  if (UrlManager.getToken())
    return;
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
