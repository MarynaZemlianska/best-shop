/**
 * Resolves project-root-relative paths (e.g. "src/assets/images/x.jpg") to an
 * absolute URL, anchored on this script's own file location rather than the
 * current page. That means it works the same from index.html and from any
 * page under src/html/, regardless of nesting depth or deployment root.
 */
(function () {
  var scriptEl = document.currentScript;
  var scriptSrc = scriptEl ? scriptEl.src : window.location.href;
  var rootUrl = new URL('../../../', scriptSrc);

  function assetUrl(relativePath) {
    return new URL(relativePath, rootUrl).href;
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.paths = {
    rootUrl: rootUrl,
    assetUrl: assetUrl,
  };
})();
