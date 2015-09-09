var UrlManager = function() {
  UrlManager.token = undefined;
  UrlManager.color = undefined;
};

UrlManager.getToken = function() {
  return UrlManager.getPathFragment(2);
};

UrlManager.getColor = function() {
  return UrlManager.getPathFragment(1);
};

UrlManager.getPathFragment = function(indexFromEnd) {
  //remove trailing '/' and split
  var array = window.location.pathname.replace(/\/$/, '').split('/');
  var fragment = array[array.length - indexFromEnd];
  return (fragment === "" ? undefined : fragment);
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
