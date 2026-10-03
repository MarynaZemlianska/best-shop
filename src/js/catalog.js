/**
 * Catalog page: combinable filters (category/color/size/sale), sorting,
 * live search, pagination and URL query-param persistence, plus the page
 * heading/breadcrumb, active-filter chips and option counts derived from
 * the same state.
 */
(function () {
  var PAGE_SIZE = 12;
  var SKELETON_COUNT = 6;
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
  var CATEGORY_LABELS = {
    'carry-ons': 'Carry-ons',
    'suitcases': 'Suitcases',
    'luggage sets': 'Luggage Sets',
    "kids' luggage": "Kids' Luggage",
  };

  var allProducts = [];
  var loaded = false;
  var state = emptyState();

  var grid = document.getElementById('catalogGrid');
  var statusBox = document.getElementById('catalogStatus');
  var statusTitle = document.getElementById('catalogStatusTitle');
  var statusText = document.getElementById('catalogStatusText');
  var statusReset = document.getElementById('catalogStatusReset');
  var resultsCount = document.getElementById('resultsCount');
  var pagination = document.getElementById('catalogPagination');
  var sortSelect = document.getElementById('sortSelect');
  var searchInput = document.getElementById('catalogSearch');
  var resetBtn = document.getElementById('resetFilters');
  var sidebar = document.getElementById('catalogSidebar');
  var filtersToggle = document.getElementById('filtersToggle');
  var filtersClose = document.getElementById('filtersClose');
  var filtersApply = document.getElementById('filtersApply');
  var filtersCount = document.getElementById('filtersCount');
  var saleCheckbox = document.getElementById('filterSaleOnly');
  var activeFilters = document.getElementById('activeFilters');
  var titleEl = document.getElementById('catalogTitle');
  var breadcrumbCatalog = document.getElementById('breadcrumbCatalog');
  var breadcrumbSep = document.getElementById('breadcrumbSep');
  var breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

  function emptyState() {
    return { categories: [], colors: [], sizes: [], saleOnly: false, sort: 'default', search: '', page: 1 };
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

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

  function activeFilterCount() {
    return state.categories.length + state.colors.length + state.sizes.length + (state.saleOnly ? 1 : 0);
  }

  // Heading + breadcrumb + document title describe what is being shown.
  function pageLabel() {
    if (state.search) return 'Results for “' + state.search + '”';
    if (state.categories.length === 1 && activeFilterCount() === 1) {
      return CATEGORY_LABELS[state.categories[0]] || capitalize(state.categories[0]);
    }
    if (state.saleOnly && activeFilterCount() === 1) return 'Sale';
    return '';
  }

  function renderHeading() {
    var label = pageLabel();
    titleEl.textContent = label || 'All luggage';
    document.title = (label || 'Catalog') + ' — Best Shop';

    var hasCurrent = Boolean(label);
    breadcrumbSep.hidden = !hasCurrent;
    breadcrumbCurrent.hidden = !hasCurrent;
    breadcrumbCurrent.textContent = label;
    if (hasCurrent) breadcrumbCatalog.removeAttribute('aria-current');
    else breadcrumbCatalog.setAttribute('aria-current', 'page');
  }

  function makeChip(label, onRemove) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip';
    chip.setAttribute('aria-label', 'Remove filter: ' + label);
    var text = document.createElement('span');
    text.textContent = label;
    var icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '×';
    chip.append(text, icon);
    chip.addEventListener('click', function () {
      onRemove();
      state.page = 1;
      syncControlsFromState();
      render();
    });
    return chip;
  }

  function renderActiveFilters() {
    activeFilters.innerHTML = '';
    var chips = [];
    state.categories.forEach(function (c) {
      chips.push(makeChip(CATEGORY_LABELS[c] || c, function () {
        state.categories = state.categories.filter(function (v) { return v !== c; });
      }));
    });
    state.colors.forEach(function (c) {
      chips.push(makeChip(capitalize(c), function () {
        state.colors = state.colors.filter(function (v) { return v !== c; });
      }));
    });
    state.sizes.forEach(function (s) {
      chips.push(makeChip('Size ' + s, function () {
        state.sizes = state.sizes.filter(function (v) { return v !== s; });
      }));
    });
    if (state.saleOnly) chips.push(makeChip('On sale', function () { state.saleOnly = false; }));
    if (state.search) chips.push(makeChip('“' + state.search + '”', function () { state.search = ''; }));

    var count = activeFilterCount();
    filtersCount.hidden = !count;
    filtersCount.textContent = String(count);

    activeFilters.hidden = !chips.length;
    if (!chips.length) return;
    chips.forEach(function (chip) { activeFilters.appendChild(chip); });

    var clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'filter-chip-clear';
    clear.textContent = 'Clear all';
    clear.addEventListener('click', resetAll);
    activeFilters.appendChild(clear);
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
      if (options.ariaLabel) btn.setAttribute('aria-label', options.ariaLabel);
      if (options.active) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () {
        state.page = page;
        render();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return btn;
    }

    pagination.appendChild(makeButton('←', state.page - 1, { disabled: state.page <= 1, ariaLabel: 'Previous page' }));
    for (var i = 1; i <= totalPages; i += 1) {
      pagination.appendChild(makeButton(String(i), i, { active: i === state.page, ariaLabel: 'Page ' + i }));
    }
    pagination.appendChild(makeButton('→', state.page + 1, { disabled: state.page >= totalPages, ariaLabel: 'Next page' }));
  }

  function showStatus(title, text, withReset) {
    statusTitle.textContent = title;
    statusText.textContent = text || '';
    statusReset.hidden = !withReset;
    statusBox.hidden = false;
  }

  function render() {
    var filtered = filterProducts(allProducts);
    var sorted = sortProducts(filtered);
    var totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    state.page = Math.min(state.page, totalPages);

    var start = (state.page - 1) * PAGE_SIZE;
    var pageItems = sorted.slice(start, start + PAGE_SIZE);

    grid.innerHTML = '';
    statusBox.hidden = true;
    if (!sorted.length) {
      showStatus('No products found',
        'Try removing a filter or searching for something else.', true);
      resultsCount.textContent = '0 products';
    } else {
      pageItems.forEach(function (product) {
        grid.appendChild(renderApi.createProductCard(product));
      });
      resultsCount.textContent = sorted.length > PAGE_SIZE
        ? 'Showing ' + (start + 1) + '–' + Math.min(start + PAGE_SIZE, sorted.length) + ' of ' + sorted.length + ' products'
        : sorted.length + (sorted.length === 1 ? ' product' : ' products');
    }

    if (filtersApply) {
      filtersApply.textContent = sorted.length
        ? 'Show ' + sorted.length + (sorted.length === 1 ? ' product' : ' products')
        : 'No matching products';
    }

    renderHeading();
    renderActiveFilters();
    renderPagination(totalPages);
    writeStateToUrl();
  }

  // Number of products for each filter option (out of the whole catalog).
  function renderOptionCounts() {
    function setCount(selector, count) {
      var el = document.querySelector(selector);
      if (el) el.textContent = String(count);
    }
    checkboxesFor('category').forEach(function (cb) {
      setCount('[data-count-category="' + cb.value + '"]',
        allProducts.filter(function (p) { return p.category === cb.value; }).length);
    });
    checkboxesFor('color').forEach(function (cb) {
      setCount('[data-count-color="' + cb.value + '"]',
        allProducts.filter(function (p) { return p.color === cb.value; }).length);
    });
    checkboxesFor('size').forEach(function (cb) {
      setCount('[data-count-size="' + cb.value + '"]',
        allProducts.filter(function (p) { return productsApi.matchesSize(p, cb.value); }).length);
    });
    setCount('#saleCount', allProducts.filter(function (p) { return p.salesStatus; }).length);
  }

  function showSkeletons() {
    grid.innerHTML = '';
    for (var i = 0; i < SKELETON_COUNT; i += 1) grid.appendChild(renderApi.createSkeletonCard());
  }

  function resetAll() {
    state = emptyState();
    syncControlsFromState();
    render();
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
        if (loaded) render();
      });
    });

    if (saleCheckbox) {
      saleCheckbox.addEventListener('change', function () {
        state.saleOnly = saleCheckbox.checked;
        saleCheckbox.closest('label').classList.toggle('is-active', state.saleOnly);
        state.page = 1;
        if (loaded) render();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        state.page = 1;
        if (loaded) render();
      });
    }

    if (resetBtn) resetBtn.addEventListener('click', function () { if (loaded) resetAll(); });
    if (statusReset) statusReset.addEventListener('click', resetAll);

    if (searchInput) {
      var debounceTimer = null;
      searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          state.search = searchInput.value.trim();
          state.page = 1;
          if (loaded) render();
        }, 200);
      });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        clearTimeout(debounceTimer);
        state.search = searchInput.value.trim();
        state.page = 1;
        if (!loaded) return;
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
    function isOpen() {
      return sidebar.classList.contains('is-open');
    }
    function onKeydown(e) {
      if (e.key === 'Escape') closeFilters();
      else modalApi.trapFocus(sidebar, e);
    }
    function openFilters() {
      if (isOpen()) return;
      sidebar.classList.add('is-open');
      filtersToggle.setAttribute('aria-expanded', 'true');
      modalApi.lockScroll();
      document.addEventListener('keydown', onKeydown);
      if (filtersClose) filtersClose.focus();
    }
    function closeFilters() {
      if (!isOpen()) return;
      sidebar.classList.remove('is-open');
      filtersToggle.setAttribute('aria-expanded', 'false');
      modalApi.unlockScroll();
      document.removeEventListener('keydown', onKeydown);
      modalApi.restoreFocus(filtersToggle);
    }
    filtersToggle.addEventListener('click', openFilters);
    if (filtersClose) filtersClose.addEventListener('click', closeFilters);
    if (filtersApply) filtersApply.addEventListener('click', closeFilters);

    // The drawer is a sidebar above 1024px (must match respond(tablet) in
    // _catalog.scss); don't leave the page scroll-locked if the viewport
    // grows while it is open.
    var mobileQuery = window.matchMedia('(max-width: 1024px)');
    var onBreakpointChange = function (e) {
      if (!e.matches) closeFilters();
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpointChange);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpointChange);
  }

  document.addEventListener('DOMContentLoaded', function () {
    readStateFromUrl();
    syncControlsFromState();
    setupFilterInputs();
    setupMobileFilters();
    renderHeading();
    showSkeletons();

    productsApi.loadProducts()
      .then(function (products) {
        allProducts = products;
        loaded = true;
        renderOptionCounts();
        render();
      })
      .catch(function () {
        grid.innerHTML = '';
        showStatus('Could not load the catalog', 'Please refresh the page.', false);
        resultsCount.textContent = '';
      });
  });
})();
