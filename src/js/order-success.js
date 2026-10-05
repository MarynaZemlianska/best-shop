/**
 * Order confirmation page (order-success.html?id=…). Reads the saved demo
 * order and moves focus to the success heading for screen-reader users.
 */
(function () {
  var ordersApi = window.BestShop.orders;
  var formatApi = window.BestShop.format;

  function text(id, value) {
    document.getElementById(id).textContent = value;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var id = new URLSearchParams(window.location.search).get('id');
    var order = ordersApi.getOrderById(id);
    document.getElementById('orderLoading').hidden = true;

    if (!order) {
      document.getElementById('orderMissing').hidden = false;
      return;
    }

    var delivery = ordersApi.DELIVERY_METHODS[order.deliveryMethod];
    text('successNumber', order.orderNumber);
    text('successNumberFact', order.orderNumber);
    text('successTotal', formatApi.money(order.total));
    var methodLabel = ordersApi.PAYMENT_METHODS[order.paymentMethod].label;
    var statusLabel = ordersApi.PAYMENT_STATUSES[order.paymentStatus];
    text('successPayment', methodLabel === statusLabel ? methodLabel : methodLabel + ' · ' + statusLabel);
    text('successDelivery', delivery.label + ' · ' + (order.delivery ? formatApi.money(order.delivery) : 'Free'));
    text('successEmail', order.customer.email);
    document.getElementById('viewOrderLink').href = 'order.html?id=' + encodeURIComponent(order.id);
    document.title = 'Order ' + order.orderNumber + ' confirmed — Best Shop';

    document.getElementById('successContent').hidden = false;
    document.getElementById('successTitle').focus();
  });
})();
