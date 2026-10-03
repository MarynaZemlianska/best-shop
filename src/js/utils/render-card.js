/**
 * Single product-card renderer shared by the home page, catalog and the
 * "You May Also Like" block, so markup/behavior never drifts between pages.
 * Builds nodes through the DOM API only (no innerHTML with product data).
 *
 * Card layout: the product name is the one real link; it is stretched over
 * the whole card with CSS, so the image and empty space are clickable too
 * while keyboard users get a single tab stop plus the "Add to cart" button.
 */
(function () {
  var PLACEHOLDER = 'src/assets/images/placeholder.svg';

  function assetUrl(path) {
    return window.BestShop.paths.assetUrl(path);
  }

  // Absolute URL, so links work from index.html (site root) as well as from
  // pages inside src/html/.
  function productUrl(product) {
    return assetUrl('src/html/product-card.html?id=' + encodeURIComponent(product.id));
  }

  function formatRating(rating) {
    var value = Number(rating) || 0;
    return value.toFixed(1);
  }

  // Star rating that supports fractions: five outline stars with a filled
  // copy clipped to the rating width (see components/_rating.scss).
  function createRating(rating, options) {
    options = options || {};
    var value = Math.max(0, Math.min(5, Number(rating) || 0));

    var wrap = document.createElement('span');
    wrap.className = 'rating' + (options.size ? ' rating--' + options.size : '');
    wrap.setAttribute('role', 'img');
    wrap.setAttribute('aria-label', 'Rated ' + formatRating(value) + ' out of 5');

    var stars = document.createElement('span');
    stars.className = 'rating__stars';
    stars.style.setProperty('--rating', String(value));
    stars.setAttribute('aria-hidden', 'true');
    wrap.appendChild(stars);

    if (options.showValue !== false) {
      var label = document.createElement('span');
      label.className = 'rating__value';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = formatRating(value);
      wrap.appendChild(label);
    }
    return wrap;
  }

  function createImage(product, className) {
    var img = document.createElement('img');
    img.className = className;
    img.src = assetUrl(product.imageUrl);
    img.alt = product.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 296;
    img.height = 400;
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError);
      img.src = assetUrl(PLACEHOLDER);
      img.classList.add('is-placeholder');
    });
    return img;
  }

  function onAdded(button, product) {
    var label = button.querySelector('.product-card__cta-label');
    button.classList.add('is-added');
    if (label) label.textContent = 'Added';
    clearTimeout(button._bsAddedTimer);
    button._bsAddedTimer = setTimeout(function () {
      button.classList.remove('is-added');
      if (label) label.textContent = 'Add to cart';
    }, 1600);

    if (window.BestShop.toast) {
      window.BestShop.toast.show({
        title: 'Added to cart',
        message: product.name,
        actionLabel: 'View cart',
        actionHref: assetUrl('src/html/cart.html'),
      });
    }
  }

  function createProductCard(product, options) {
    options = options || {};
    var card = document.createElement('article');
    card.className = 'product-card';

    var media = document.createElement('div');
    media.className = 'product-card__media';
    media.appendChild(createImage(product, 'product-card__img'));

    if (product.salesStatus) {
      var badge = document.createElement('span');
      badge.className = 'product-card__badge';
      badge.textContent = 'Sale';
      media.appendChild(badge);
    }

    var body = document.createElement('div');
    body.className = 'product-card__body';

    var meta = document.createElement('p');
    meta.className = 'product-card__meta';
    meta.textContent = product.category + ' · ' + product.size;

    var title = document.createElement('h3');
    title.className = 'product-card__title';
    var link = document.createElement('a');
    link.className = 'product-card__link';
    link.href = productUrl(product);
    link.textContent = product.name;
    link.title = product.name;
    title.appendChild(link);

    var footer = document.createElement('div');
    footer.className = 'product-card__footer';

    var price = document.createElement('p');
    price.className = 'product-card__price';
    price.textContent = '$' + product.price;

    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn product-card__cta';
    addBtn.setAttribute('aria-label', 'Add ' + product.name + ' to cart');
    addBtn.innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';
    var ctaLabel = document.createElement('span');
    ctaLabel.className = 'product-card__cta-label';
    ctaLabel.textContent = 'Add to cart';
    addBtn.appendChild(ctaLabel);
    addBtn.addEventListener('click', function () {
      window.BestShop.cart.addToCart(product, { quantity: 1 });
      onAdded(addBtn, product);
      if (typeof options.onAdd === 'function') options.onAdd(product);
    });

    footer.append(price, addBtn);
    body.append(meta, title, createRating(product.rating, { size: 'sm' }), footer);
    card.append(media, body);
    return card;
  }

  // Loading placeholder with the same footprint as a real card (no layout
  // shift when products arrive).
  function createSkeletonCard() {
    var card = document.createElement('div');
    card.className = 'product-card product-card--skeleton';
    card.setAttribute('aria-hidden', 'true');
    card.innerHTML = '<div class="product-card__media"></div>' +
      '<div class="product-card__body"><span class="skeleton-line"></span>' +
      '<span class="skeleton-line skeleton-line--wide"></span><span class="skeleton-line"></span></div>';
    return card;
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.renderCard = {
    createProductCard: createProductCard,
    createSkeletonCard: createSkeletonCard,
    createRating: createRating,
    productUrl: productUrl,
  };
})();
