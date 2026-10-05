/**
 * Order details page (order.html?id=…): status timeline, items with the
 * prices saved at purchase time, totals recalculated from those items,
 * delivery address, customer and payment information.
 */
(function () {
  var ordersApi = window.BestShop.orders;
  var viewApi = window.BestShop.orderView;
  var formatApi = window.BestShop.format;
  var el = viewApi.el;

  function addFact(dl, label, value) {
    if (!value) return;
    var row = el('div');
    row.append(el('dt', '', label), el('dd', '', value));
    dl.appendChild(row);
  }

  function renderAddress(order) {
    var address = document.getElementById('orderAddress');
    address.innerHTML = '';
    var a = order.shippingAddress;
    var lines = [
      [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' '),
      a.address,
      [a.postalCode, a.city].filter(Boolean).join(' '),
      a.country,
    ].filter(Boolean);
    lines.forEach(function (line) { address.appendChild(el('span', 'order-address__line', line)); });

    var method = ordersApi.DELIVERY_METHODS[order.deliveryMethod];
    document.getElementById('orderDeliveryMethod').textContent =
      method.label + ' · ' + (order.delivery ? formatApi.money(order.delivery) : 'Free');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var id = new URLSearchParams(window.location.search).get('id');
    var order = ordersApi.getOrderById(id);
    document.getElementById('orderLoading').hidden = true;

    if (!order) {
      document.getElementById('orderMissing').hidden = false;
      document.getElementById('orderCrumb').textContent = 'Order not found';
      document.title = 'Order not found — Best Shop';
      return;
    }

    document.title = 'Order ' + order.orderNumber + ' — Best Shop';
    document.getElementById('orderCrumb').textContent = order.orderNumber;
    document.getElementById('orderTitle').textContent = 'Order ' + order.orderNumber;
    document.getElementById('orderDate').textContent = 'Placed on ' + formatApi.date(order.createdAt);

    var badges = document.getElementById('orderBadges');
    badges.append(viewApi.orderStatusBadge(order.orderStatus), viewApi.paymentStatusBadge(order.paymentStatus));

    viewApi.renderTimeline(document.getElementById('statusTimeline'), order.orderStatus);
    viewApi.renderLines(document.getElementById('orderLines'), order.items);
    viewApi.renderTotals(document.getElementById('orderTotals'), order, order.deliveryMethod);
    renderAddress(order);

    var customer = document.getElementById('orderCustomer');
    addFact(customer, 'Name', [order.customer.firstName, order.customer.lastName].filter(Boolean).join(' '));
    addFact(customer, 'Email', order.customer.email);
    addFact(customer, 'Phone', order.customer.phone);

    var payment = document.getElementById('orderPayment');
    addFact(payment, 'Method', ordersApi.PAYMENT_METHODS[order.paymentMethod].label);
    addFact(payment, 'Status', ordersApi.PAYMENT_STATUSES[order.paymentStatus]);

    document.getElementById('orderContent').hidden = false;
  });
})();
