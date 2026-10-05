/**
 * Shared display formatting (money, dates) for cart, checkout and order pages.
 */
(function () {
  var moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  var dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function formatMoney(amount) {
    return moneyFormatter.format(Number(amount) || 0);
  }

  function formatDate(isoString) {
    var date = new Date(isoString);
    return isNaN(date.getTime()) ? '' : dateFormatter.format(date);
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.format = {
    money: formatMoney,
    date: formatDate,
  };
})();
