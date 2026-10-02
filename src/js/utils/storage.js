/**
 * Single source of truth for the shopping cart. Every page reads and writes
 * the cart through these functions so the data shape never drifts between
 * home.js / catalog.js / product.js / cart.js.
 *
 * Stored item shape: { id, quantity, color, size }.
 * localStorage is user-editable, so it only stores *what* was added and how
 * many. Name, price and image are always taken from the current catalog
 * (data.json) via getCartLines(); nothing price-related is read back from
 * storage. This is a client-side safeguard only — a future backend must still
 * recalculate every order total on the server.
 */
(function () {
  var CART_KEY = 'bestshop_cart';
  var DISCOUNT_THRESHOLD = 3000;
  var DISCOUNT_RATE = 0.1;
  var MAX_QUANTITY = 99;

  function isValidQuantity(value) {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1;
  }

  // Returns a clean item, or null when the stored entry is unusable.
  function sanitizeItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.id !== 'string' || !raw.id.trim()) return null;
    if (!isValidQuantity(raw.quantity)) return null;
    return {
      id: raw.id,
      quantity: Math.min(raw.quantity, MAX_QUANTITY),
      color: typeof raw.color === 'string' ? raw.color : '',
      size: typeof raw.size === 'string' ? raw.size : '',
    };
  }

  function itemKey(item) {
    return item.id + '|' + item.color + '|' + item.size;
  }

  // Drops invalid entries and merges duplicates of the same id/color/size.
  function sanitizeCart(list) {
    if (!Array.isArray(list)) return [];
    var byKey = {};
    var result = [];
    list.forEach(function (raw) {
      var item = sanitizeItem(raw);
      if (!item) return;
      var key = itemKey(item);
      if (byKey[key]) {
        byKey[key].quantity = Math.min(byKey[key].quantity + item.quantity, MAX_QUANTITY);
      } else {
        byKey[key] = item;
        result.push(item);
      }
    });
    return result;
  }

  function readRaw() {
    try {
      return localStorage.getItem(CART_KEY);
    } catch (err) {
      return null;
    }
  }

  function getCart() {
    var raw = readRaw();
    if (!raw) return [];
    try {
      return sanitizeCart(JSON.parse(raw));
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    var clean = sanitizeCart(cart);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(clean));
    } catch (err) {
      // Storage full or blocked (e.g. private mode): keep the page usable.
    }
    updateCartCounter();
    return clean;
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
    var requested = Math.floor(Number(options.quantity));
    var quantity = Math.min(Math.max(1, requested || 1), MAX_QUANTITY);
    var color = options.color || product.color || '';
    var size = options.size || product.size || '';
    var cart = getCart();
    var index = findIndex(cart, product.id, color, size);

    if (index > -1) {
      cart[index].quantity = Math.min(cart[index].quantity + quantity, MAX_QUANTITY);
    } else {
      cart.push({ id: product.id, quantity: quantity, color: color, size: size });
    }
    return saveCart(cart);
  }

  function removeFromCart(id, color, size) {
    var cart = getCart();
    var index = findIndex(cart, id, color, size);
    if (index > -1) cart.splice(index, 1);
    return saveCart(cart);
  }

  function updateQuantity(id, color, size, quantity) {
    var cart = getCart();
    var index = findIndex(cart, id, color, size);
    if (index > -1) {
      var next = Math.floor(Number(quantity)) || 1;
      cart[index].quantity = Math.min(Math.max(1, next), MAX_QUANTITY);
      return saveCart(cart);
    }
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function isValidProduct(product) {
    return Boolean(product) && typeof product.price === 'number' &&
      Number.isFinite(product.price) && product.price >= 0;
  }

  function findProduct(products, id) {
    return products.find(function (p) { return p.id === id; }) || null;
  }

  // An item is only kept if its product still exists and the stored
  // color/size match what that product actually offers.
  function matchesCatalog(item, products) {
    var product = findProduct(products, item.id);
    return isValidProduct(product) &&
      item.color === (product.color || '') &&
      item.size === (product.size || '');
  }

  // Removes items that no longer match the catalog and persists the result
  // (only when something actually changed).
  function syncWithCatalog(products) {
    var cart = getCart();
    var synced = cart.filter(function (item) { return matchesCatalog(item, products); });
    if (synced.length !== cart.length || readRaw() !== JSON.stringify(synced)) {
      return saveCart(synced);
    }
    updateCartCounter();
    return synced;
  }

  // Cart items joined with current catalog data — the only place prices,
  // names and images for the cart come from.
  function getCartLines(products) {
    return getCart().reduce(function (lines, item) {
      if (!matchesCatalog(item, products)) return lines;
      var product = findProduct(products, item.id);
      lines.push({
        id: item.id,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      return lines;
    }, []);
  }

  function getCartCount() {
    return getCart().reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
  }

  function getSubtotal(lines) {
    return (lines || []).reduce(function (sum, line) {
      return sum + line.price * line.quantity;
    }, 0);
  }

  function getDiscount(subtotal) {
    return subtotal > DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;
  }

  function getTotal(subtotal) {
    return Math.max(0, subtotal - getDiscount(subtotal));
  }

  function updateCartCounter() {
    var count = getCartCount();
    document.querySelectorAll('.cart-count').forEach(function (el) {
      el.textContent = String(count);
      el.style.display = count > 0 ? '' : 'none';
    });
    document.querySelectorAll('.cart-icon').forEach(function (link) {
      link.setAttribute('aria-label', count > 0
        ? 'View cart, ' + count + (count === 1 ? ' item' : ' items')
        : 'View cart, empty');
    });
  }

  // Another tab changed the cart: refresh the counter and let the current
  // page re-render (cart.js listens for this event).
  window.addEventListener('storage', function (e) {
    if (e.key !== CART_KEY && e.key !== null) return;
    updateCartCounter();
    document.dispatchEvent(new CustomEvent('bestshop:cartchange'));
  });

  window.BestShop = window.BestShop || {};
  window.BestShop.cart = {
    getCart: getCart,
    saveCart: saveCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    clearCart: clearCart,
    syncWithCatalog: syncWithCatalog,
    getCartLines: getCartLines,
    getCartCount: getCartCount,
    getSubtotal: getSubtotal,
    getDiscount: getDiscount,
    getTotal: getTotal,
    updateCartCounter: updateCartCounter,
    DISCOUNT_THRESHOLD: DISCOUNT_THRESHOLD,
    DISCOUNT_RATE: DISCOUNT_RATE,
    MAX_QUANTITY: MAX_QUANTITY,
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCounter();
    // Keep the header counter honest on every page: drop items whose product
    // was removed from the catalog. products.js loads after this file, so it
    // is looked up here rather than at parse time.
    var productsApi = window.BestShop.products;
    if (productsApi) {
      productsApi.loadProducts().then(syncWithCatalog).catch(function () {});
    }
  });
})();
