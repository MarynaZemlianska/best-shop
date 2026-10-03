/**
 * Home page: "Popular now" (top products by the `popularity` field),
 * "New arrivals" (products flagged with the "New Products Arrival" block)
 * and live product counts on the category cards — all from data.json.
 */
(function () {
  var POPULAR_COUNT = 8;
  var CATEGORY_BY_SLUG = {
    'carry-ons': 'carry-ons',
    'suitcases': 'suitcases',
    'luggage-sets': 'luggage sets',
    'kids-luggage': "kids' luggage",
  };

  var renderApi = window.BestShop.renderCard;

  function showSkeletons(gridEl, count) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    for (var i = 0; i < count; i += 1) gridEl.appendChild(renderApi.createSkeletonCard());
  }

  function renderGrid(gridEl, statusEl, products, emptyMessage) {
    if (!gridEl) return;
    gridEl.innerHTML = '';
    if (!products.length) {
      if (statusEl) statusEl.textContent = emptyMessage;
      return;
    }
    if (statusEl) statusEl.textContent = '';
    products.forEach(function (product) {
      gridEl.appendChild(renderApi.createProductCard(product));
    });
  }

  function popularProducts(products) {
    return products.slice().sort(function (a, b) {
      return (b.popularity - a.popularity) || (b.rating - a.rating);
    }).slice(0, POPULAR_COUNT);
  }

  function renderCategoryCounts(products) {
    document.querySelectorAll('[data-category-count]').forEach(function (el) {
      var category = CATEGORY_BY_SLUG[el.getAttribute('data-category-count')];
      var count = products.filter(function (p) { return p.category === category; }).length;
      el.textContent = count + (count === 1 ? ' product' : ' products');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var popularGrid = document.getElementById('popularProductsGrid');
    var popularStatus = document.getElementById('popularProductsStatus');
    var arrivalsGrid = document.getElementById('newArrivalsGrid');
    var arrivalsStatus = document.getElementById('newArrivalsStatus');

    showSkeletons(popularGrid, 4);
    showSkeletons(arrivalsGrid, 3);

    window.BestShop.products.loadProducts()
      .then(function (products) {
        renderCategoryCounts(products);
        renderGrid(popularGrid, popularStatus, popularProducts(products), 'No products yet.');
        renderGrid(
          arrivalsGrid,
          arrivalsStatus,
          products.filter(function (p) { return (p.blocks || []).indexOf('New Products Arrival') > -1; }),
          'No new arrivals yet.'
        );
      })
      .catch(function () {
        [popularGrid, arrivalsGrid].forEach(function (grid) { if (grid) grid.innerHTML = ''; });
        if (popularStatus) popularStatus.textContent = 'Could not load products. Please try again later.';
        if (arrivalsStatus) arrivalsStatus.textContent = 'Could not load products. Please try again later.';
      });
  });
})();
