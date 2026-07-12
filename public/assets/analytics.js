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

  function armInteractionLoader() {
    var events = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
    var options = { once: true, passive: true };

    function onFirstIntent() {
      events.forEach(function (eventName) {
        window.removeEventListener(eventName, onFirstIntent, options);
      });
      loadAnalytics();
    }

    events.forEach(function (eventName) {
      window.addEventListener(eventName, onFirstIntent, options);
    });

    window.setTimeout(loadAnalytics, 12000);
  }

  if (document.readyState === 'complete') {
    armInteractionLoader();
  } else {
    window.addEventListener('load', armInteractionLoader, { once: true });
  }
})();
