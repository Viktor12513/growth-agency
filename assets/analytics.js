(function () {
  var measurementId = 'G-ML4E8DFP54';
  var loaded = false;

  function loadAnalytics() {
    if (loaded || !measurementId) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', measurementId, { anonymize_ip: true });
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadAnalytics, { timeout: 3500 });
  } else {
    window.addEventListener('load', function () {
      window.setTimeout(loadAnalytics, 1800);
    }, { once: true });
  }
})();
