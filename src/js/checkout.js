/**
 * Checkout page (demo — no real payment is processed).
 *
 * Prices always come from data.json via cart.getCartLines(); nothing price
 * related is read from the form or from storage. Card fields are validated in
 * memory only: their values are never written to an object that outlives the
 * submit handler, never stored, never logged and cleared after payment.
 */
(function () {
  var PROCESSING_DELAY = 900;
  var NAME_PATTERN = /^[\p{L}][\p{L}' .-]*$/u;
  var PLACE_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  var PHONE_CHARS = /^[+\d\s()-]+$/;
  var POSTAL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/;

  var cartApi = window.BestShop.cart;
  var productsApi = window.BestShop.products;
  var ordersApi = window.BestShop.orders;
  var customerApi = window.BestShop.customer;
  var viewApi = window.BestShop.orderView;
  var formatApi = window.BestShop.format;
  var pathsApi = window.BestShop.paths;

  var catalog = null;
  var submitAttempted = false;
  var submitting = false;

  var form = document.getElementById('checkoutForm');
  var layout = document.getElementById('checkoutLayout');
  var loading = document.getElementById('checkoutLoading');
  var emptyState = document.getElementById('checkoutEmpty');
  var formAlert = document.getElementById('formAlert');
  var cardFields = document.getElementById('cardFields');
  var placeOrderBtn = document.getElementById('placeOrderBtn');
  var summaryDetails = document.getElementById('summaryDetails');

  function lengthBetween(value, min, max) {
    return value.length >= min && value.length <= max;
  }

  function nameRule(label) {
    return function (value) {
      if (!value) return 'Enter your ' + label + '.';
      if (!lengthBetween(value, 2, 50) || !NAME_PATTERN.test(value)) return 'Enter a valid ' + label + '.';
      return '';
    };
  }

  function placeRule(label) {
    return function (value) {
      if (!value) return 'Enter your ' + label + '.';
      if (!lengthBetween(value, 2, 60) || !PLACE_PATTERN.test(value)) return 'Enter a valid ' + label + '.';
      return '';
    };
  }

  // Contact + address fields (always required).
  var FIELD_RULES = {
    firstName: nameRule('first name'),
    lastName: nameRule('last name'),
    email: function (value) {
      if (!value) return 'Enter your email address.';
      return EMAIL_PATTERN.test(value) ? '' : 'Enter a valid email, e.g. name@example.com.';
    },
    phone: function (value) {
      if (!value) return 'Enter your phone number.';
      var digits = value.replace(/\D/g, '');
      if (!PHONE_CHARS.test(value) || digits.length < 7 || digits.length > 15) {
        return 'Enter a valid phone number (7–15 digits).';
      }
      return '';
    },
    country: placeRule('country'),
    city: placeRule('city'),
    address: function (value) {
      if (!value) return 'Enter your street address.';
      return lengthBetween(value, 5, 120) ? '' : 'Enter a full street address.';
    },
    postalCode: function (value) {
      if (!value) return 'Enter your postal code.';
      return POSTAL_PATTERN.test(value) ? '' : 'Enter a valid postal code.';
    },
  };

  // Demo card checks only — format, not a real bank validation.
  var CARD_RULES = {
    cardNumber: function (value) {
      var digits = value.replace(/\s/g, '');
      if (!digits) return 'Enter the card number.';
      return /^\d{16}$/.test(digits) ? '' : 'Card number must have 16 digits.';
    },
    cardExpiry: function (value) {
      if (!value) return 'Enter the expiry date.';
      var match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
      if (!match) return 'Use the MM/YY format.';
      var now = new Date();
      var expiryEnd = new Date(2000 + Number(match[2]), Number(match[1]), 1);
      return expiryEnd > now ? '' : 'This card has expired.';
    },
    cardCvc: function (value) {
      if (!value) return 'Enter the CVC.';
      return /^\d{3}$/.test(value) ? '' : 'CVC must have 3 digits.';
    },
    cardName: function (value) {
      if (!value) return 'Enter the cardholder name.';
      return lengthBetween(value, 2, 60) && NAME_PATTERN.test(value) ? '' : 'Enter a valid name.';
    },
  };

  function input(id) {
    return document.getElementById(id);
  }

  function setFieldError(field, message) {
    var errorEl = document.getElementById(field.id + 'Error');
    if (errorEl) errorEl.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validateField(id) {
    var field = input(id);
    var rule = FIELD_RULES[id] || CARD_RULES[id];
    var message = rule(field.value.trim());
    setFieldError(field, message);
    return message;
  }

  function selectedValue(name) {
    var checked = form.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }

  function validateChoice(name, errorId, message) {
    var value = selectedValue(name);
    document.getElementById(errorId).textContent = value ? '' : message;
    form.querySelectorAll('input[name="' + name + '"]').forEach(function (radio) {
      radio.setAttribute('aria-invalid', value ? 'false' : 'true');
    });
    return value ? '' : message;
  }

  function isCardPayment() {
    return selectedValue('paymentMethod') === 'card';
  }

  // Returns the first invalid control, or null.
  function validateAll() {
    var firstInvalid = null;
    var count = 0;
    function track(control, message) {
      if (!message) return;
      count += 1;
      if (!firstInvalid) firstInvalid = control;
    }
    Object.keys(FIELD_RULES).forEach(function (id) { track(input(id), validateField(id)); });
    track(form.querySelector('input[name="deliveryMethod"]'),
      validateChoice('deliveryMethod', 'deliveryMethodError', 'Choose a delivery method.'));
    track(form.querySelector('input[name="paymentMethod"]'),
      validateChoice('paymentMethod', 'paymentMethodError', 'Choose a payment method.'));
    if (isCardPayment()) {
      Object.keys(CARD_RULES).forEach(function (id) { track(input(id), validateField(id)); });
    }
    return { firstInvalid: firstInvalid, count: count };
  }

  function showAlert(message) {
    formAlert.textContent = message;
    formAlert.hidden = !message;
  }

  /* Live validation: on blur once the field has a value (or after the first
     submit attempt); while typing only to clear/update an existing error. */
  function setupLiveValidation() {
    Object.keys(FIELD_RULES).concat(Object.keys(CARD_RULES)).forEach(function (id) {
      var field = input(id);
      field.addEventListener('blur', function () {
        if (submitAttempted || field.value.trim()) validateField(id);
      });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(id);
      });
    });
  }

  function setupCardFormatting() {
    var number = input('cardNumber');
    number.addEventListener('input', function () {
      var digits = number.value.replace(/\D/g, '').slice(0, 16);
      number.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
    var expiry = input('cardExpiry');
    expiry.addEventListener('input', function (e) {
      var digits = expiry.value.replace(/\D/g, '').slice(0, 4);
      var deleting = e.inputType && e.inputType.indexOf('delete') === 0;
      expiry.value = digits.length > 2 || (digits.length === 2 && !deleting)
        ? digits.slice(0, 2) + '/' + digits.slice(2)
        : digits;
    });
    var cvc = input('cardCvc');
    cvc.addEventListener('input', function () {
      cvc.value = cvc.value.replace(/\D/g, '').slice(0, 3);
    });
  }

  function clearCardFields() {
    Object.keys(CARD_RULES).forEach(function (id) {
      var field = input(id);
      field.value = '';
      setFieldError(field, '');
    });
  }

  function setupPaymentChoice() {
    form.querySelectorAll('input[name="paymentMethod"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        var card = isCardPayment();
        cardFields.hidden = !card;
        if (!card) clearCardFields();
        validateChoice('paymentMethod', 'paymentMethodError', 'Choose a payment method.');
        placeOrderBtn.textContent = card ? 'Pay ' + currentTotalText() : 'Place order';
      });
    });
  }

  function renderDeliveryOptions() {
    var container = document.getElementById('deliveryOptions');
    container.innerHTML = '';
    Object.keys(ordersApi.DELIVERY_METHODS).forEach(function (id, index) {
      var method = ordersApi.DELIVERY_METHODS[id];
      var label = viewApi.el('label', 'choice');
      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'deliveryMethod';
      radio.value = id;
      radio.checked = index === 0;
      var body = viewApi.el('span', 'choice__body');
      body.append(viewApi.el('span', 'choice__title', method.label),
        viewApi.el('span', 'choice__text', method.description));
      var price = viewApi.el('span', 'choice__price', method.price ? formatApi.money(method.price) : 'Free');
      label.append(radio, body, price);
      radio.addEventListener('change', function () {
        validateChoice('deliveryMethod', 'deliveryMethodError', 'Choose a delivery method.');
        renderSummary();
      });
      container.appendChild(label);
    });
  }

  function currentLines() {
    return catalog ? cartApi.getCartLines(catalog) : [];
  }

  function currentTotals() {
    var lines = currentLines();
    return ordersApi.calculateTotals(lines.map(function (l) {
      return { price: l.price, quantity: l.quantity };
    }), selectedValue('deliveryMethod') || 'standard');
  }

  function currentTotalText() {
    return formatApi.money(currentTotals().total);
  }

  function renderSummary() {
    var lines = currentLines();
    if (!lines.length) {
      showEmpty();
      return;
    }
    var totals = currentTotals();
    viewApi.renderLines(document.getElementById('summaryLines'), lines);
    viewApi.renderTotals(document.getElementById('summaryTotals'), totals, selectedValue('deliveryMethod') || 'standard');
    document.getElementById('summaryToggleTotal').textContent = formatApi.money(totals.total);
    if (isCardPayment()) placeOrderBtn.textContent = 'Pay ' + formatApi.money(totals.total);
  }

  function showEmpty() {
    loading.hidden = true;
    layout.hidden = true;
    emptyState.hidden = false;
  }

  function prefillCustomer() {
    var saved = customerApi.getCustomer();
    if (!saved) return;
    customerApi.FIELDS.forEach(function (field) {
      if (saved[field] && input(field)) input(field).value = saved[field];
    });
  }

  // On phones the summary starts collapsed (total stays visible in the
  // toggle); on wider screens it is always open.
  function setupSummaryToggle() {
    var query = window.matchMedia('(max-width: 1024px)');
    function apply() {
      summaryDetails.open = !query.matches;
      summaryDetails.classList.toggle('is-static', !query.matches);
      summaryDetails.querySelector('summary').tabIndex = query.matches ? 0 : -1;
    }
    apply();
    if (query.addEventListener) query.addEventListener('change', apply);
    else if (query.addListener) query.addListener(apply);
  }

  function readCustomerData() {
    var data = {};
    customerApi.FIELDS.forEach(function (field) { data[field] = input(field).value.trim(); });
    return data;
  }

  function setSubmitting(state, label) {
    submitting = state;
    placeOrderBtn.disabled = state;
    placeOrderBtn.setAttribute('aria-busy', state ? 'true' : 'false');
    if (label) placeOrderBtn.textContent = label;
  }

  function placeOrder() {
    var lines = currentLines();
    if (!lines.length) {
      showEmpty();
      return;
    }
    var data = readCustomerData();
    var paymentMethod = selectedValue('paymentMethod');
    var order = ordersApi.createOrder({
      customer: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
      shippingAddress: { country: data.country, city: data.city, address: data.address, postalCode: data.postalCode },
      deliveryMethod: selectedValue('deliveryMethod'),
      paymentMethod: paymentMethod,
      lines: lines,
    });

    if (!order || !ordersApi.saveOrder(order)) {
      setSubmitting(false, paymentMethod === 'card' ? 'Pay ' + currentTotalText() : 'Place order');
      showAlert('Your order could not be saved in this browser. Please check that site storage is enabled and try again.');
      formAlert.focus();
      return;
    }

    // Only after the order exists: forget card input, empty the cart and
    // (optionally) remember contact/delivery details.
    clearCardFields();
    cartApi.clearCart();
    if (input('saveDetails').checked) customerApi.saveCustomer(data);
    else customerApi.clearCustomer();

    window.location.href = pathsApi.assetUrl('src/html/order-success.html?id=' + encodeURIComponent(order.id));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    submitAttempted = true;

    var result = validateAll();
    if (result.firstInvalid) {
      showAlert(result.count === 1
        ? 'Please correct the highlighted field.'
        : 'Please correct the ' + result.count + ' highlighted fields.');
      result.firstInvalid.focus();
      return;
    }
    showAlert('');

    // Simulated payment/processing delay — nothing is sent anywhere.
    setSubmitting(true, isCardPayment() ? 'Processing payment…' : 'Placing order…');
    setTimeout(placeOrder, PROCESSING_DELAY);
  }

  document.addEventListener('DOMContentLoaded', function () {
    productsApi.loadProducts()
      .then(function (products) {
        catalog = products;
        cartApi.syncWithCatalog(products);
        if (!currentLines().length) {
          showEmpty();
          return;
        }
        renderDeliveryOptions();
        prefillCustomer();
        setupSummaryToggle();
        setupLiveValidation();
        setupCardFormatting();
        setupPaymentChoice();
        renderSummary();
        form.addEventListener('submit', onSubmit);
        loading.hidden = true;
        layout.hidden = false;
      })
      .catch(function () {
        loading.textContent = 'Could not load current prices. Please refresh the page.';
      });

    // The cart was changed in another tab while checkout is open.
    document.addEventListener('bestshop:cartchange', function () {
      if (!catalog || submitting) return;
      cartApi.syncWithCatalog(catalog);
      renderSummary();
    });
  });
})();
