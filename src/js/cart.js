/**
 * Cart page: renders items through the shared cart module (storage.js),
 * recalculates totals/discount live, and handles the clear-cart confirmation
 * and demo checkout modal. Prices, names and images always come from the
 * current catalog (data.json), never from localStorage.
 */
(function () {
  var cartApi = window.BestShop.cart;
  var modalApi = window.BestShop.modal;
  var pathsApi = window.BestShop.paths;
  var productsApi = window.BestShop.products;

  var catalog = null;

  var itemsContainer = document.getElementById('cartItemsContainer');
  var emptyState = document.getElementById('cartEmpty');
  var cartBottom = document.getElementById('cartBottom');
  var subtotalEl = document.getElementById('cartSubtotal');
  var totalEl = document.getElementById('cartTotal');
  var discountRow = document.getElementById('cartDiscountRow');
  var discountEl = document.getElementById('cartDiscount');
  var clearCartBtn = document.getElementById('clearCartBtn');
  var checkoutBtn = document.getElementById('checkoutBtn');
  var checkoutModal = document.getElementById('checkoutModal');
  var checkoutClose = document.getElementById('checkoutClose');
  var checkoutForm = document.getElementById('checkoutForm');
  var checkoutMessage = document.getElementById('checkoutMessage');

  function formatMoney(amount) {
    return '$' + amount.toFixed(2).replace(/\.00$/, '');
  }

  function showStatus(message) {
    itemsContainer.innerHTML = '';
    var status = document.createElement('p');
    status.className = 'cart-status';
    status.setAttribute('role', 'status');
    status.textContent = message;
    itemsContainer.appendChild(status);
    emptyState.hidden = true;
    cartBottom.hidden = true;
  }

  function buildRow(item) {
    var row = document.createElement('div');
    row.className = 'cart-item';

    var img = document.createElement('img');
    img.className = 'cart-img';
    img.src = pathsApi.assetUrl(item.imageUrl);
    img.alt = item.name;
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError);
      img.src = pathsApi.assetUrl('src/assets/images/placeholder.svg');
    });

    var info = document.createElement('div');
    info.className = 'product-info';
    var title = document.createElement('h3');
    title.textContent = item.name;
    info.appendChild(title);
    if (item.color || item.size) {
      var variant = document.createElement('p');
      variant.textContent = [item.color, item.size].filter(Boolean).join(' · ');
      info.appendChild(variant);
    }

    var price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatMoney(item.price);

    var quantity = document.createElement('div');
    quantity.className = 'quantity';
    var minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'minus';
    minus.textContent = '−';
    minus.setAttribute('aria-label', 'Decrease quantity of ' + item.name);
    minus.disabled = item.quantity <= 1;
    var qtyValue = document.createElement('span');
    qtyValue.textContent = item.quantity;
    var plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'plus';
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Increase quantity of ' + item.name);
    plus.disabled = item.quantity >= cartApi.MAX_QUANTITY;
    quantity.append(minus, qtyValue, plus);

    var total = document.createElement('div');
    total.className = 'total';
    total.textContent = formatMoney(item.price * item.quantity);

    var deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '🗑️';
    deleteBtn.setAttribute('aria-label', 'Remove ' + item.name + ' from cart');

    minus.addEventListener('click', function () {
      cartApi.updateQuantity(item.id, item.color, item.size, item.quantity - 1);
      renderCart();
    });
    plus.addEventListener('click', function () {
      cartApi.updateQuantity(item.id, item.color, item.size, item.quantity + 1);
      renderCart();
    });
    deleteBtn.addEventListener('click', function () {
      cartApi.removeFromCart(item.id, item.color, item.size);
      renderCart();
    });

    row.append(img, info, price, quantity, total, deleteBtn);
    return row;
  }

  function renderCart() {
    if (!catalog) return;
    var cart = cartApi.getCartLines(catalog);
    itemsContainer.innerHTML = '';

    if (!cart.length) {
      emptyState.hidden = false;
      cartBottom.hidden = true;
      return;
    }

    emptyState.hidden = true;
    cartBottom.hidden = false;

    var header = document.createElement('div');
    header.className = 'cart-grid-header';
    ['Image', 'Product Name', 'Price', 'Quantity', 'Total', 'Delete'].forEach(function (label) {
      var cell = document.createElement('div');
      cell.textContent = label;
      header.appendChild(cell);
    });
    itemsContainer.appendChild(header);

    cart.forEach(function (item) {
      itemsContainer.appendChild(buildRow(item));
    });

    var subtotal = cartApi.getSubtotal(cart);
    var discount = cartApi.getDiscount(subtotal);

    subtotalEl.textContent = formatMoney(subtotal);
    if (discount > 0) {
      discountRow.hidden = false;
      discountEl.textContent = '-' + formatMoney(discount);
    } else {
      discountRow.hidden = true;
    }
    totalEl.textContent = formatMoney(cartApi.getTotal(subtotal));
  }

  function setupClearCart() {
    if (!clearCartBtn) return;
    clearCartBtn.addEventListener('click', function () {
      modalApi.confirmDialog('Remove all items from your cart?', function () {
        cartApi.clearCart();
        renderCart();
      });
    });
  }

  function validateCheckoutField(input, errorEl, message) {
    var value = input.value.trim();
    if (!value) {
      errorEl.textContent = message;
      return false;
    }
    errorEl.textContent = '';
    return true;
  }

  function setupCheckout() {
    if (!checkoutBtn || !checkoutModal) return;

    checkoutBtn.addEventListener('click', function () {
      if (!catalog || !cartApi.getCartLines(catalog).length) return;
      checkoutMessage.textContent = '';
      modalApi.openModal(checkoutModal);
    });

    if (checkoutClose) {
      checkoutClose.addEventListener('click', function () { modalApi.closeModal(checkoutModal); });
    }

    checkoutForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      var fields = [
        ['checkoutName', 'checkoutNameError', 'Name is required.'],
        ['checkoutPhone', 'checkoutPhoneError', 'Phone number is required.'],
        ['checkoutCountry', 'checkoutCountryError', 'Country is required.'],
        ['checkoutCity', 'checkoutCityError', 'City is required.'],
        ['checkoutAddress', 'checkoutAddressError', 'Delivery address is required.'],
      ];

      var valid = fields.reduce(function (isValid, field) {
        var input = document.getElementById(field[0]);
        var errorEl = document.getElementById(field[1]);
        return validateCheckoutField(input, errorEl, field[2]) && isValid;
      }, true);

      var emailInput = document.getElementById('checkoutEmail');
      var emailError = document.getElementById('checkoutEmailError');
      if (!emailPattern.test(emailInput.value.trim())) {
        emailError.textContent = 'Enter a valid email address.';
        valid = false;
      } else {
        emailError.textContent = '';
      }

      if (!valid) return;

      cartApi.clearCart();
      renderCart();
      checkoutForm.reset();
      checkoutMessage.style.color = '#2b9c2b';
      checkoutMessage.textContent = 'Thank you! Your order has been placed in demo mode — no real payment was taken.';
      setTimeout(function () { modalApi.closeModal(checkoutModal); }, 2200);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupClearCart();
    setupCheckout();
    showStatus('Loading your cart…');

    productsApi.loadProducts()
      .then(function (products) {
        catalog = products;
        cartApi.syncWithCatalog(products);
        renderCart();
      })
      .catch(function () {
        // Without current prices the cart can't be totalled safely, so
        // checkout stays hidden.
        showStatus('Could not load current prices. Please refresh the page.');
      });

    // The cart was changed in another tab.
    document.addEventListener('bestshop:cartchange', function () {
      if (!catalog) return;
      cartApi.syncWithCatalog(catalog);
      renderCart();
    });
  });
})();
