/**
 * Optional "remember my details" storage for checkout (localStorage key
 * `bestshop_customer`). Only contact and delivery fields are whitelisted —
 * payment data (card number, expiry, CVC, cardholder) can never be stored
 * through this module.
 */
(function () {
  var CUSTOMER_KEY = 'bestshop_customer';
  var FIELDS = ['firstName', 'lastName', 'email', 'phone', 'country', 'city', 'address', 'postalCode'];
  var MAX_TEXT = 120;

  function sanitize(source) {
    var result = {};
    FIELDS.forEach(function (field) {
      var value = source && source[field];
      result[field] = typeof value === 'string' ? value.trim().slice(0, MAX_TEXT) : '';
    });
    return result;
  }

  function getCustomer() {
    try {
      var raw = localStorage.getItem(CUSTOMER_KEY);
      return raw ? sanitize(JSON.parse(raw)) : null;
    } catch (err) {
      return null;
    }
  }

  function saveCustomer(data) {
    try {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(sanitize(data)));
      return true;
    } catch (err) {
      return false;
    }
  }

  function clearCustomer() {
    try {
      localStorage.removeItem(CUSTOMER_KEY);
    } catch (err) {
      // Storage blocked: nothing was saved anyway.
    }
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.customer = {
    FIELDS: FIELDS,
    getCustomer: getCustomer,
    saveCustomer: saveCustomer,
    clearCustomer: clearCustomer,
  };
})();
