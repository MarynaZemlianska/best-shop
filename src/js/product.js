/**
 * Product details page: loads the product referenced by ?id= from the
 * shared product cache, renders its data, and handles quantity, add-to-cart,
 * tabs and per-product reviews (kept in LocalStorage, one list per id).
 */
(function () {
  var productsApi = window.BestShop.products;
  var cartApi = window.BestShop.cart;
  var renderApi = window.BestShop.renderCard;
  var pathsApi = window.BestShop.paths;

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  function reviewsKey(id) {
    return 'bestshop_reviews_' + id;
  }

  function getReviews(id) {
    try {
      var raw = localStorage.getItem(reviewsKey(id));
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveReview(id, review) {
    var reviews = getReviews(id);
    reviews.unshift(review);
    localStorage.setItem(reviewsKey(id), JSON.stringify(reviews));
    return reviews;
  }

  function showNotFound() {
    document.getElementById('productLoading').hidden = true;
    document.getElementById('productContent').hidden = true;
    document.getElementById('productNotFound').hidden = false;
  }

  function renderSpecTable(product) {
    var table = document.getElementById('specTable');
    var rows = [
      ['Product ID', product.id],
      ['Category', product.category],
      ['Color', product.color],
      ['Size', product.size],
      ['Rating', product.rating + ' / 5'],
      ['Popularity', product.popularity + '%'],
      ['Availability', product.salesStatus ? 'On sale' : 'Regular price'],
    ];
    table.innerHTML = '';
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      th.textContent = row[0];
      var td = document.createElement('td');
      td.textContent = row[1];
      tr.append(th, td);
      table.appendChild(tr);
    });
  }

  function renderProduct(product) {
    document.title = 'Best Shop - ' + product.name;
    document.getElementById('breadcrumbCurrent').textContent = product.name;

    var mainImage = document.getElementById('mainImage');
    mainImage.src = pathsApi.assetUrl(product.imageUrl);
    mainImage.alt = product.name;
    mainImage.addEventListener('error', function onError() {
      mainImage.removeEventListener('error', onError);
      mainImage.src = pathsApi.assetUrl('src/assets/images/placeholder.svg');
    });

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productRating').textContent = renderApi.ratingToStars(product.rating);
    document.getElementById('productPrice').textContent = '$' + product.price +
      (product.salesStatus ? ' · Sale' : '');
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('tabDescriptionText').textContent = product.description;

    var meta = document.getElementById('productMeta');
    meta.innerHTML = '';
    [
      ['Category', product.category],
      ['Color', product.color],
      ['Size', product.size],
    ].forEach(function (pair) {
      var li = document.createElement('li');
      var strong = document.createElement('strong');
      strong.textContent = pair[0] + ': ';
      li.appendChild(strong);
      li.appendChild(document.createTextNode(pair[1]));
      meta.appendChild(li);
    });

    renderSpecTable(product);

    document.getElementById('productLoading').hidden = true;
    document.getElementById('productContent').hidden = false;
  }

  function setupQuantity() {
    var input = document.getElementById('qtyInput');
    var minus = document.getElementById('qtyMinus');
    var plus = document.getElementById('qtyPlus');

    function clamp() {
      var value = Math.max(1, Math.floor(Number(input.value)) || 1);
      input.value = value;
      return value;
    }

    input.addEventListener('input', clamp);
    minus.addEventListener('click', function () {
      input.value = Math.max(1, clamp() - 1);
    });
    plus.addEventListener('click', function () {
      input.value = clamp() + 1;
    });

    return function getQuantity() { return clamp(); };
  }

  function setupAddToCart(product, getQuantity) {
    var btn = document.getElementById('addToCartBtn');
    var status = document.getElementById('addToCartStatus');
    btn.addEventListener('click', function () {
      cartApi.addToCart(product, { quantity: getQuantity(), color: product.color, size: product.size });
      status.textContent = 'Added ' + getQuantity() + ' × ' + product.name + ' to your cart.';
      setTimeout(function () { status.textContent = ''; }, 4000);
    });
  }

  function setupTabs() {
    var tabs = [
      { btn: document.getElementById('tabBtnDescription'), panel: document.getElementById('tabDescription') },
      { btn: document.getElementById('tabBtnInfo'), panel: document.getElementById('tabAdditionalInfo') },
      { btn: document.getElementById('tabBtnReviews'), panel: document.getElementById('tabReviews') },
    ];
    tabs.forEach(function (tab) {
      tab.btn.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.btn.classList.toggle('active', t === tab);
          t.btn.setAttribute('aria-selected', String(t === tab));
          t.panel.hidden = t !== tab;
        });
      });
    });
  }

  function renderReviews(productId, productName) {
    var reviews = getReviews(productId);
    var list = document.getElementById('reviewsList');
    var title = document.getElementById('reviewCountTitle');
    title.textContent = reviews.length +
      (reviews.length === 1 ? ' review' : ' reviews') + ' for ' + productName;

    list.innerHTML = '';
    if (!reviews.length) {
      var empty = document.createElement('p');
      empty.className = 'reviews-empty';
      empty.textContent = 'No reviews yet — be the first to share your experience.';
      list.appendChild(empty);
      return;
    }

    reviews.forEach(function (review) {
      var card = document.createElement('div');
      card.className = 'review-card';

      var avatar = document.createElement('img');
      avatar.className = 'review-avatar';
      avatar.src = pathsApi.assetUrl('src/assets/images/product-cart-user.jpg');
      avatar.alt = '';

      var body = document.createElement('div');

      var row = document.createElement('div');
      row.className = 'review-row';
      var author = document.createElement('span');
      author.className = 'review-author';
      author.textContent = review.name;
      var date = document.createElement('span');
      date.className = 'review-date';
      date.textContent = '/ ' + review.date;
      row.append(author, date);

      var stars = document.createElement('div');
      stars.className = 'review-stars';
      stars.textContent = renderApi.ratingToStars(review.rating);

      var text = document.createElement('p');
      text.className = 'review-text';
      text.textContent = review.text;

      body.append(row, stars, text);
      card.append(avatar, body);
      list.appendChild(card);
    });
  }

  function setupReviewForm(product) {
    var form = document.getElementById('reviewForm');
    var stars = Array.prototype.slice.call(document.querySelectorAll('#ratingInput .star-btn'));
    var selectedRating = 0;
    var message = document.getElementById('reviewFormMessage');

    function paintStars(value) {
      stars.forEach(function (star) {
        var starValue = Number(star.dataset.value);
        star.textContent = starValue <= value ? '★' : '☆';
        star.setAttribute('aria-pressed', String(starValue <= value));
      });
    }

    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        selectedRating = Number(star.dataset.value);
        paintStars(selectedRating);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('reviewName');
      var emailInput = document.getElementById('reviewEmail');
      var textInput = document.getElementById('reviewText');

      var name = nameInput.value.trim();
      var email = emailInput.value.trim();
      var text = textInput.value.trim();
      var valid = true;

      document.getElementById('reviewNameError').textContent = '';
      document.getElementById('reviewEmailError').textContent = '';
      document.getElementById('reviewTextError').textContent = '';

      if (!name) {
        document.getElementById('reviewNameError').textContent = 'Name is required.';
        valid = false;
      }
      if (!EMAIL_PATTERN.test(email)) {
        document.getElementById('reviewEmailError').textContent = 'Enter a valid email address.';
        valid = false;
      }
      if (!text) {
        document.getElementById('reviewTextError').textContent = 'Please write a short review.';
        valid = false;
      }
      if (!selectedRating) {
        message.textContent = 'Please select a star rating.';
        message.style.color = '#c41b66';
        valid = false;
      }

      if (!valid) return;

      saveReview(product.id, {
        name: name,
        rating: selectedRating,
        text: text,
        date: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
      });

      renderReviews(product.id, product.name);
      form.reset();
      selectedRating = 0;
      paintStars(0);
      message.style.color = '#2b9c2b';
      message.textContent = 'Thank you! Your review has been submitted.';
    });
  }

  function renderRelated(products, currentProduct) {
    var grid = document.getElementById('relatedProductsGrid');
    var related = productsApi.getRandomProducts(products, 4, currentProduct.id);
    grid.innerHTML = '';
    related.forEach(function (product) {
      grid.appendChild(renderApi.createProductCard(product));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
      showNotFound();
      return;
    }

    productsApi.loadProducts()
      .then(function (products) {
        var product = productsApi.getProductById(products, id);
        if (!product) {
          showNotFound();
          return;
        }
        renderProduct(product);
        var getQuantity = setupQuantity();
        setupAddToCart(product, getQuantity);
        setupTabs();
        renderReviews(product.id, product.name);
        setupReviewForm(product);
        renderRelated(products, product);
      })
      .catch(showNotFound);
  });
})();
