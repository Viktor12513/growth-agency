(function () {
  var path = window.location.pathname;
  if (path.indexOf('/blog/') === 0 && path !== '/blog/') {
    var oldSlug = path.split('/').filter(Boolean).slice(1).join('/');
    window.location.replace('/blogg/?post=' + encodeURIComponent(oldSlug));
  } else if (path.indexOf('/blogg/') === 0 && path !== '/blogg/') {
    var slug = path.split('/').filter(Boolean).slice(1).join('/');
    window.location.replace('/blogg/?post=' + encodeURIComponent(slug));
  }
})();
