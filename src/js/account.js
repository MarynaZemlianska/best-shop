/**
 * Guest account page (demo): overview from the saved customer details or the
 * latest order, plus the list of orders stored in this browser.
 */
(function () {
  var ordersApi = window.BestShop.orders;
  var customerApi = window.BestShop.customer;
  var viewApi = window.BestShop.orderView;
  var formatApi = window.BestShop.format;
  var el = viewApi.el;

  function renderOverview(orders) {
    var saved = customerApi.getCustomer();
    var source = saved && (saved.firstName || saved.email) ? saved : orders[0] && orders[0].customer;
    var name = source ? [source.firstName, source.lastName].filter(Boolean).join(' ') : '';

    document.getElementById('accountName').textContent = name || 'Guest';
    document.getElementById('accountEmail').textContent = (source && source.email) || 'No saved details yet';
    document.getElementById('accountOrderCount').textContent = String(orders.length);
    document.getElementById('accountLastOrder').textContent = orders.length
      ? 'Last order on ' + formatApi.date(orders[0].createdAt)
      : '';
  }

  function orderRow(order) {
    var li = el('li', 'order-row');
    var url = 'order.html?id=' + encodeURIComponent(order.id);

    var head = el('div', 'order-row__head');
    var number = el('a', 'order-row__number', order.orderNumber);
    number.href = url;
    var date = el('time', 'order-row__date', formatApi.date(order.createdAt));
    date.dateTime = order.createdAt;
    head.append(number, date);

    var itemCount = order.items.reduce(function (sum, item) { return sum + item.quantity; }, 0);
    var facts = el('dl', 'order-row__facts');
    [
      ['Items', String(itemCount)],
      ['Total', formatApi.money(order.total)],
    ].forEach(function (pair) {
      var row = el('div');
      row.append(el('dt', '', pair[0]), el('dd', '', pair[1]));
      facts.appendChild(row);
    });

    var badges = el('div', 'order-row__badges');
    badges.append(viewApi.orderStatusBadge(order.orderStatus), viewApi.paymentStatusBadge(order.paymentStatus));

    var link = el('a', 'btn btn--secondary btn--sm order-row__link', 'View details');
    link.href = url;
    link.setAttribute('aria-label', 'View details of order ' + order.orderNumber);

    li.append(head, facts, badges, link);
    return li;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var orders = ordersApi.getOrders();
    renderOverview(orders);

    var list = document.getElementById('ordersList');
    list.innerHTML = '';
    if (!orders.length) {
      document.getElementById('ordersEmpty').hidden = false;
      return;
    }
    orders.forEach(function (order) { list.appendChild(orderRow(order)); });
  });
})();
