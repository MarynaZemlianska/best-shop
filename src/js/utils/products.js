/**
 * Fetches and caches the product catalog from src/assets/data.json.
 * All pages read products through this module instead of duplicating
 * fetch/parse logic.
 */
(function () {
  var cache = null;
  var pendingRequest = null;

  function loadProducts() {
    if (cache) return Promise.resolve(cache);
    if (pendingRequest) return pendingRequest;

    var dataUrl = window.BestShop.paths.assetUrl('src/assets/data.json');
    pendingRequest = fetch(dataUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load products: HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        cache = Array.isArray(json.data) ? json.data : [];
        pendingRequest = null;
        return cache;
      })
      .catch(function (err) {
        pendingRequest = null;
        throw err;
      });

    return pendingRequest;
  }

  function getProductById(products, id) {
    return products.find(function (p) { return p.id === id; }) || null;
  }

  function getRandomProducts(products, count, excludeId) {
    var pool = products.filter(function (p) { return p.id !== excludeId; });
    var shuffled = pool.slice().sort(function () { return Math.random() - 0.5; });
    return shuffled.slice(0, count);
  }

  function matchesSize(product, sizeValue) {
    return String(product.size || '')
      .split(',')
      .map(function (s) { return s.trim().toLowerCase(); })
      .indexOf(sizeValue.toLowerCase()) > -1;
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.products = {
    loadProducts: loadProducts,
    getProductById: getProductById,
    getRandomProducts: getRandomProducts,
    matchesSize: matchesSize,
  };
})();
