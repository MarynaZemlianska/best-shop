/**
 * Catalog page: combinable filters (category/color/size/sale), sorting,
 * live search, pagination and URL query-param persistence.
 */
(function () {
  var PAGE_SIZE = 12;
  var cartApi = window.BestShop.cart;
  var modalApi = window.BestShop.modal;
  var productsApi = window.BestShop.products;
  var renderApi = window.BestShop.renderCard;

  var CATEGORY_SLUGS = {
    'carry-ons': 'carry-ons',
    'suitcases': 'suitcases',
    'luggage-sets': 'luggage sets',
    'kids-luggage': "kids' luggage",
  };
  var CATEGORY_TO_SLUG = Object.keys(CATEGORY_SLUGS).reduce(function (map, slug) {
    map[CATEGORY_SLUGS[slug]] = slug;
    return map;
  }, {});

  var allProducts = [];
  var state = {
    categories: [],
    colors: [],
    sizes: [],
    saleOnly: false,
    sort: 'default',
    search: '',
    page: 1,
  };

  var grid = document.getElementById('catalogGrid');
  var statusEl = document.getElementById('catalogStatus');
  var resultsCount = document.getElementById('resultsCount');
  var pagination = document.getElementById('catalogPagination');
  var sortSelect = document.getElementById('sortSelect');
  var searchInput = document.getElementById('catalogSearch');
  var resetBtn = document.getElementById('resetFilters');
  var sidebar = document.getElementById('catalogSidebar');
  var filtersToggle = document.getElementById('filtersToggle');
  var filtersClose = document.getElementById('filtersClose');
  var saleCheckbox = document.getElementById('filterSaleOnly');
  var topProductsList = document.getElementById('topProductsList');

  function checkboxesFor(filterName) {
    var group = document.querySelector('.filter-group[data-filter="' + filterName + '"]');
    return group ? Array.prototype.slice.call(group.querySelectorAll('input[type="checkbox"]')) : [];
  }

  function readStateFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var categoryParam = params.get('category');
    if (categoryParam) {
      state.categories = categoryParam.split(',').map(function (slug) {
        return CATEGORY_SLUGS[slug] || slug;
      });
    }
    if (params.get('color')) state.colors = params.get('color').split(',');
    if (params.get('size')) state.sizes = params.get('size').split(',');
    state.saleOnly = params.get('sale') === 'true';
    state.sort = params.get('sort') || 'default';
    state.search = params.get('search') || '';
    state.page = Math.max(1, Number(params.get('page')) || 1);
  }

  function writeStateToUrl() {
    var params = new URLSearchParams();
    if (state.categories.length) {
      params.set('category', state.categories.map(function (c) { return CATEGORY_TO_SLUG[c] || c; }).join(','));
    }
    if (state.colors.length) params.set('color', state.colors.join(','));
    if (state.sizes.length) params.set('size', state.sizes.join(','));
    if (state.saleOnly) params.set('sale', 'true');
    if (state.sort !== 'default') params.set('sort', state.sort);
    if (state.search) params.set('search', state.search);
    if (state.page > 1) params.set('page', String(state.page));
    var query = params.toString();
    var newUrl = window.location.pathname + (query ? '?' + query : '');
    window.history.replaceState({}, '', newUrl);
  }

  function syncControlsFromState() {
    checkboxesFor('category').forEach(function (cb) {
      cb.checked = state.categories.indexOf(cb.value) > -1;
      cb.closest('label').classList.toggle('is-active', cb.checked);
    });
    checkboxesFor('color').forEach(function (cb) {
      cb.checked = state.colors.indexOf(cb.value) > -1;
      cb.closest('label').classList.toggle('is-active', cb.checked);
    });
    checkboxesFor('size').forEach(function (cb) {
      cb.checked = state.sizes.indexOf(cb.value) > -1;
      cb.closest('label').classList.toggle('is-active', cb.checked);
    });
    if (saleCheckbox) {
      saleCheckbox.checked = state.saleOnly;
      saleCheckbox.closest('label').classList.toggle('is-active', state.saleOnly);
    }
    if (sortSelect) sortSelect.value = state.sort;
    if (searchInput) searchInput.value = state.search;
  }

  function filterProducts(products) {
    return products.filter(function (p) {
      if (state.categories.length && state.categories.indexOf(p.category) === -1) return false;
      if (state.colors.length && state.colors.indexOf(p.color) === -1) return false;
      if (state.sizes.length) {
        var matchesAnySize = state.sizes.some(function (size) { return productsApi.matchesSize(p, size); });
        if (!matchesAnySize) return false;
      }
      if (state.saleOnly && !p.salesStatus) return false;
      if (state.search) {
        var haystack = [p.name, p.category, p.color, p.id].join(' ').toLowerCase();
        if (haystack.indexOf(state.search.toLowerCase()) === -1) return false;
      }
      return true;
    });
  }

  function sortProducts(list) {
    var sorted = list.slice();
    if (state.sort === 'price-asc') sorted.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === 'price-desc') sorted.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === 'popularity') sorted.sort(function (a, b) { return b.popularity - a.popularity; });
    else if (state.sort === 'rating') sorted.sort(function (a, b) { return b.rating - a.rating; });
    return sorted;
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = '';
    if (totalPages <= 1) return;

    function makeButton(label, page, options) {
      options = options || {};
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'page' + (options.active ? ' active' : '');
      btn.textContent = label;
      btn.disabled = Boolean(options.disabled);
      btn.addEventListener('click', function () {
        state.page = page;
        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return btn;
    }

    pagination.appendChild(makeButton('← Prev', state.page - 1, { disabled: state.page <= 1 }));
    for (var i = 1; i <= totalPages; i += 1) {
      pagination.appendChild(makeButton(String(i), i, { active: i === state.page }));
    }
    pagination.appendChild(makeButton('Next →', state.page + 1, { disabled: state.page >= totalPages }));
  }

  function render() {
    var filtered = filterProducts(allProducts);
    var sorted = sortProducts(filtered);
    var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = sorted.slice(start, start + PAGE_SIZE);

    grid.innerHTML = '';
    if (!sorted.length) {
      statusEl.textContent = 'No products match your filters. Try adjusting or resetting them.';
      statusEl.style.display = 'block';
      resultsCount.textContent = 'Showing 0 of 0 results';
    } else {
      statusEl.style.display = 'none';
      pageItems.forEach(function (product) {
        grid.appendChild(renderApi.createProductCard(product));
      });
      resultsCount.textContent =
        'Showing ' + (start + 1) + '–' + Math.min(start + PAGE_SIZE, sorted.length) + ' of ' + sorted.length + ' results';
    }

    renderPagination(totalPages);
    writeStateToUrl();
  }

  function renderTopBestSets() {
    if (!topProductsList) return;
    var sets = allProducts.filter(function (p) { return p.category === 'luggage sets'; });
    var pool = sets.length >= 5 ? sets : allProducts.slice().sort(function (a, b) { return b.rating - a.rating; });
    var picks = pool.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 5);

    topProductsList.innerHTML = '';
    picks.forEach(function (product) {
      var item = document.createElement('a');
      item.className = 'top-product';
      item.href = renderApi.productUrl(product);

      var img = document.createElement('img');
      img.src = window.BestShop.paths.assetUrl(product.imageUrl);
      img.alt = product.name;
      img.addEventListener('error', function onError() {
        img.removeEventListener('error', onError);
        img.src = window.BestShop.paths.assetUrl('src/assets/images/placeholder.svg');
      });

      var info = document.createElement('div');
      info.className = 'top-product-info';

      var title = document.createElement('p');
      title.className = 'tp-title';
      title.textContent = product.name;

      var stars = document.createElement('div');
      stars.className = 'tp-stars';
      stars.textContent = renderApi.ratingToStars(product.rating);

      var price = document.createElement('div');
      price.className = 'tp-price';
      price.textContent = '$' + product.price;

      info.append(title, stars, price);
      item.append(img, info);
      topProductsList.appendChild(item);
    });
  }

  function setupFilterInputs() {
    checkboxesFor('category').concat(checkboxesFor('color'), checkboxesFor('size')).forEach(function (cb) {
      cb.addEventListener('change', function () {
        var filterName = cb.closest('.filter-group').dataset.filter;
        var key = filterName === 'category' ? 'categories' : filterName + 's';
        var current = state[key];
        if (cb.checked) current.push(cb.value);
        else state[key] = current.filter(function (v) { return v !== cb.value; });
        cb.closest('label').classList.toggle('is-active', cb.checked);
        state.page = 1;
        render();
      });
    });

    if (saleCheckbox) {
      saleCheckbox.addEventListener('change', function () {
        state.saleOnly = saleCheckbox.checked;
        saleCheckbox.closest('label').classList.toggle('is-active', state.saleOnly);
        state.page = 1;
        render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        state.page = 1;
        render();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        state = { categories: [], colors: [], sizes: [], saleOnly: false, sort: 'default', search: '', page: 1 };
        syncControlsFromState();
        render();
      });
    }

    if (searchInput) {
      var debounceTimer = null;
      searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          state.search = searchInput.value.trim();
          state.page = 1;
          render();
        }, 200);
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        clearTimeout(debounceTimer);
        state.search = searchInput.value.trim();
        state.page = 1;
        var matches = filterProducts(allProducts);
        if (state.search && matches.length === 1) {
          window.location.href = renderApi.productUrl(matches[0]);
          return;
        }
        render();
      });
    }
  }

  function setupMobileFilters() {
    if (!filtersToggle || !sidebar) return;
    function openFilters() {
      sidebar.classList.add('is-open');
      filtersToggle.setAttribute('aria-expanded', 'true');
      modalApi.lockScroll();
    }
    function closeFilters() {
      sidebar.classList.remove('is-open');
      filtersToggle.setAttribute('aria-expanded', 'false');
      modalApi.unlockScroll();
    }
    filtersToggle.addEventListener('click', openFilters);
    if (filtersClose) filtersClose.addEventListener('click', closeFilters);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeFilters();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    readStateFromUrl();
    syncControlsFromState();
    setupFilterInputs();
    setupMobileFilters();

    productsApi.loadProducts()
      .then(function (products) {
        allProducts = products;
        render();
        renderTopBestSets();
      })
      .catch(function () {
        statusEl.textContent = 'Could not load the catalog. Please refresh the page.';
        statusEl.style.display = 'block';
        resultsCount.textContent = '';
      });
  });
})();
