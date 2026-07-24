/**
 * Single product-card renderer shared by the home page, catalog and the
 * "You May Also Like" block, so markup/behavior never drifts between pages.
 * Builds nodes through the DOM API only (no innerHTML with product data).
 */
(function () {
  function ratingToStars(rating) {
    var rounded = Math.round(Number(rating || 0) * 2) / 2;
    var full = Math.floor(rounded);
    var half = rounded - full === 0.5;
    var empty = 5 - full - (half ? 1 : 0);
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(Math.max(0, empty));
  }

  function productUrl(product) {
    return 'product-card.html?id=' + encodeURIComponent(product.id);
  }

  function createProductCard(product, options) {
    options = options || {};
    var card = document.createElement('article');
    card.className = 'card-item product-card';

    var link = document.createElement('a');
    link.className = 'card-img-link';
    link.href = productUrl(product);
    link.setAttribute('aria-label', 'View ' + product.name);

    var imgWrap = document.createElement('div');
    imgWrap.className = 'card-img';

    var img = document.createElement('img');
    img.src = window.BestShop.paths.assetUrl(product.imageUrl);
    img.alt = product.name;
    img.loading = 'lazy';
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError);
      img.src = window.BestShop.paths.assetUrl('src/assets/images/placeholder.svg');
    });
    imgWrap.appendChild(img);

    if (product.salesStatus) {
      var badge = document.createElement('span');
      badge.className = 'sale-badge';
      badge.textContent = 'Sale';
      imgWrap.appendChild(badge);
    }

    link.appendChild(imgWrap);

    var content = document.createElement('div');
    content.className = 'card-content';

    var title = document.createElement('h4');
    var titleLink = document.createElement('a');
    titleLink.href = productUrl(product);
    titleLink.textContent = product.name;
    title.appendChild(titleLink);

    var meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = product.category + ' · ' + product.size;

    var rating = document.createElement('div');
    rating.className = 'card-rating';
    rating.textContent = ratingToStars(product.rating);
    rating.setAttribute('aria-label', 'Rating ' + product.rating + ' out of 5');

    var price = document.createElement('div');
    price.className = 'price';
    price.textContent = '$' + product.price;

    var actions = document.createElement('div');
    actions.className = 'card-actions';

    var addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn';
    addBtn.textContent = 'Add to Cart';
    addBtn.addEventListener('click', function () {
      window.BestShop.cart.addToCart(product, { quantity: 1 });
      if (typeof options.onAdd === 'function') options.onAdd(product);
    });

    var viewLink = document.createElement('a');
    viewLink.className = 'btn btn-outline';
    viewLink.href = productUrl(product);
    viewLink.textContent = 'View Product';

    actions.append(addBtn, viewLink);
    content.append(title, meta, rating, price, actions);
    card.append(link, content);
    return card;
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.renderCard = {
    createProductCard: createProductCard,
    ratingToStars: ratingToStars,
    productUrl: productUrl,
  };
})();
