/**
 * Demo order storage (portfolio project — no backend, no real payments).
 *
 * Orders live in localStorage under `bestshop_orders`, separate from the cart.
 * Every order read back from storage goes through normalizeOrder(): unknown
 * fields are dropped, labels/prices of delivery methods come from the rules
 * below, and subtotal/discount/total are recalculated from the stored line
 * items, so an edited total in localStorage is never displayed.
 *
 * Payment data (card number, expiry, CVC, holder) is never part of an order.
 * The API (getOrders / getOrderById / createOrder / saveOrder) is the seam a
 * real backend would replace later.
 */
(function () {
  var ORDERS_KEY = 'bestshop_orders';
  var ID_PATTERN = /^[a-z0-9]{8,40}$/;
  var NUMBER_PATTERN = /^BS-(\d{4})-(\d{4,})$/;
  var IMAGE_PATTERN = /^src\/assets\/images\/[\w.-]+$/;
  var MAX_TEXT = 120;

  var ORDER_STATUSES = [
    { id: 'received', label: 'Order received' },
    { id: 'processing', label: 'Processing' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  var PAYMENT_STATUSES = {
    paid: 'Paid',
    pay_on_delivery: 'Pay on delivery',
  };

  var PAYMENT_METHODS = {
    card: { id: 'card', label: 'Card (demo payment)', initialStatus: 'paid' },
    cod: { id: 'cod', label: 'Pay on delivery', initialStatus: 'pay_on_delivery' },
  };

  // Demo delivery rates — clearly labelled in the UI, not real business rules.
  var DELIVERY_METHODS = {
    standard: { id: 'standard', label: 'Standard delivery', description: '2–5 business days', price: 0 },
    express: { id: 'express', label: 'Express delivery', description: 'Faster delivery · demo rate', price: 25 },
  };

  var CUSTOMER_FIELDS = ['firstName', 'lastName', 'email', 'phone'];
  var ADDRESS_FIELDS = ['country', 'city', 'address', 'postalCode'];

  function cleanText(value) {
    return typeof value === 'string' ? value.trim().slice(0, MAX_TEXT) : '';
  }

  function pick(source, fields) {
    var result = {};
    fields.forEach(function (field) {
      result[field] = cleanText(source && source[field]);
    });
    return result;
  }

  function roundMoney(value) {
    return Math.round(value * 100) / 100;
  }

  function normalizeItem(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var price = Number(raw.price);
    var quantity = raw.quantity;
    if (typeof raw.id !== 'string' || !raw.id) return null;
    if (!Number.isFinite(price) || price < 0) return null;
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return null;
    return {
      id: cleanText(raw.id),
      name: cleanText(raw.name),
      price: roundMoney(price),
      quantity: quantity,
      color: cleanText(raw.color),
      size: cleanText(raw.size),
      imageUrl: IMAGE_PATTERN.test(raw.imageUrl) ? raw.imageUrl : 'src/assets/images/placeholder.svg',
    };
  }

  function calculateTotals(items, deliveryId) {
    var cartApi = window.BestShop.cart;
    var subtotal = roundMoney(items.reduce(function (sum, item) {
      return sum + item.price * item.quantity;
    }, 0));
    var discount = roundMoney(cartApi.getDiscount(subtotal));
    var delivery = (DELIVERY_METHODS[deliveryId] || DELIVERY_METHODS.standard).price;
    return {
      subtotal: subtotal,
      discount: discount,
      delivery: delivery,
      total: roundMoney(Math.max(0, subtotal - discount) + delivery),
    };
  }

  // Returns a clean order or null when the stored entry is unusable.
  function normalizeOrder(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (!ID_PATTERN.test(raw.id) || !NUMBER_PATTERN.test(raw.orderNumber)) return null;
    var createdAt = new Date(raw.createdAt);
    if (isNaN(createdAt.getTime())) return null;
    if (!Array.isArray(raw.items)) return null;

    var items = raw.items.map(normalizeItem).filter(Boolean);
    if (!items.length) return null;

    var delivery = DELIVERY_METHODS[raw.deliveryMethod] ? raw.deliveryMethod : 'standard';
    var payment = PAYMENT_METHODS[raw.paymentMethod] ? raw.paymentMethod : null;
    if (!payment) return null;

    var statusIds = ORDER_STATUSES.map(function (s) { return s.id; });
    var totals = calculateTotals(items, delivery);

    return {
      id: raw.id,
      orderNumber: raw.orderNumber,
      createdAt: createdAt.toISOString(),
      customer: pick(raw.customer, CUSTOMER_FIELDS),
      shippingAddress: pick(raw.shippingAddress, ADDRESS_FIELDS),
      deliveryMethod: delivery,
      paymentMethod: payment,
      paymentStatus: PAYMENT_STATUSES[raw.paymentStatus] ? raw.paymentStatus : PAYMENT_METHODS[payment].initialStatus,
      orderStatus: statusIds.indexOf(raw.orderStatus) > -1 ? raw.orderStatus : 'received',
      items: items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      delivery: totals.delivery,
      total: totals.total,
      currency: 'USD',
    };
  }

  function readRaw() {
    try {
      var parsed = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  // Newest first.
  function getOrders() {
    return readRaw().map(normalizeOrder).filter(Boolean).sort(function (a, b) {
      return b.createdAt.localeCompare(a.createdAt);
    });
  }

  function getOrderById(id) {
    if (!ID_PATTERN.test(id || '')) return null;
    return getOrders().find(function (order) { return order.id === id; }) || null;
  }

  // BS-<year>-<sequence>, sequence continues from the highest stored number.
  function generateOrderNumber(date, existingOrders) {
    var year = String(date.getFullYear());
    var used = (existingOrders || getOrders()).map(function (o) { return o.orderNumber; });
    var max = used.reduce(function (highest, number) {
      var match = NUMBER_PATTERN.exec(number);
      return match && match[1] === year ? Math.max(highest, Number(match[2])) : highest;
    }, 0);
    var next = max + 1;
    var candidate;
    do {
      candidate = 'BS-' + year + '-' + String(next).padStart(4, '0');
      next += 1;
    } while (used.indexOf(candidate) > -1);
    return candidate;
  }

  function generateId() {
    var random = Math.random().toString(36).slice(2, 10);
    return (Date.now().toString(36) + random).toLowerCase();
  }

  /**
   * Builds (but does not save) an order from checkout data.
   * `lines` must come from cart.getCartLines(catalog), i.e. prices from
   * data.json — never from the form or from storage.
   */
  function createOrder(input) {
    var now = new Date();
    var existing = getOrders();
    return normalizeOrder({
      id: generateId(),
      orderNumber: generateOrderNumber(now, existing),
      createdAt: now.toISOString(),
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      deliveryMethod: input.deliveryMethod,
      paymentMethod: input.paymentMethod,
      paymentStatus: PAYMENT_METHODS[input.paymentMethod] && PAYMENT_METHODS[input.paymentMethod].initialStatus,
      orderStatus: 'received',
      items: (input.lines || []).map(function (line) {
        return {
          id: line.id,
          name: line.name,
          price: line.price,
          quantity: line.quantity,
          color: line.color,
          size: line.size,
          imageUrl: line.imageUrl,
        };
      }),
    });
  }

  // Returns true only when the order was actually written.
  function saveOrder(order) {
    var clean = normalizeOrder(order);
    if (!clean) return false;
    var stored = readRaw().filter(function (raw) { return raw && raw.id !== clean.id; });
    stored.push(clean);
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(stored));
      return true;
    } catch (err) {
      return false;
    }
  }

  function statusLabel(statusId) {
    var status = ORDER_STATUSES.find(function (s) { return s.id === statusId; });
    return status ? status.label : '';
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.orders = {
    ORDER_STATUSES: ORDER_STATUSES,
    PAYMENT_STATUSES: PAYMENT_STATUSES,
    PAYMENT_METHODS: PAYMENT_METHODS,
    DELIVERY_METHODS: DELIVERY_METHODS,
    getOrders: getOrders,
    getOrderById: getOrderById,
    createOrder: createOrder,
    saveOrder: saveOrder,
    normalizeOrder: normalizeOrder,
    generateOrderNumber: generateOrderNumber,
    calculateTotals: calculateTotals,
    statusLabel: statusLabel,
  };
})();
