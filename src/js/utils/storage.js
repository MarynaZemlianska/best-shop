/**
 * Single source of truth for the shopping cart. Every page reads and writes
 * the cart through these functions so the data shape never drifts between
 * home.js / catalog.js / product.js / cart.js.
 * Cart item shape: { id, name, price, imageUrl, quantity, color, size }
 */
(function () {
  var CART_KEY = 'bestshop_cart';
  var DISCOUNT_THRESHOLD = 3000;
  var DISCOUNT_RATE = 0.1;

  function getCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCounter();
  }

  function findIndex(cart, id, color, size) {
    return cart.findIndex(function (item) {
      return (
        item.id === id &&
        (item.color || '') === (color || '') &&
        (item.size || '') === (size || '')
      );
    });
  }

  function addToCart(product, options) {
    options = options || {};
    var quantity = Math.max(1, Number(options.quantity) || 1);
    var color = options.color || product.color || '';
    var size = options.size || product.size || '';
    var cart = getCart();
    var index = findIndex(cart, product.id, color, size);

    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        color: color,
        size: size,
      });
    }
    saveCart(cart);
    return cart;
  }

  function removeFromCart(id, color, size) {
    var cart = getCart();
    var index = findIndex(cart, id, color, size);
    if (index > -1) cart.splice(index, 1);
    saveCart(cart);
    return cart;
  }

  function updateQuantity(id, color, size, quantity) {
    var cart = getCart();
    var index = findIndex(cart, id, color, size);
    if (index > -1) {
      cart[index].quantity = Math.max(1, Number(quantity) || 1);
      saveCart(cart);
    }
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
  }

  function getSubtotal(cart) {
    return (cart || getCart()).reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0);
  }

  function getDiscount(subtotal) {
    return subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  }

  function updateCartCounter() {
    var count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = String(count);
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.cart = {
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    clearCart: clearCart,
    getCartCount: getCartCount,
    getSubtotal: getSubtotal,
    getDiscount: getDiscount,
    updateCartCounter: updateCartCounter,
    DISCOUNT_THRESHOLD: DISCOUNT_THRESHOLD,
    DISCOUNT_RATE: DISCOUNT_RATE,
  };

  document.addEventListener('DOMContentLoaded', updateCartCounter);
})();
