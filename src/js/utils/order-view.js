/**
 * Shared, DOM-API-only rendering for order data (checkout summary, account,
 * order details): line items, totals, status badges and the status timeline.
 * Customer-entered text is only ever assigned through textContent.
 */
(function () {
  var formatApi = window.BestShop.format;
  var pathsApi = window.BestShop.paths;
  var ordersApi = window.BestShop.orders;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderLines(listEl, items) {
    listEl.innerHTML = '';
    items.forEach(function (item) {
      var li = el('li', 'order-line');

      var media = el('span', 'order-line__media');
      var img = document.createElement('img');
      img.src = pathsApi.assetUrl(item.imageUrl);
      img.alt = '';
      img.width = 64;
      img.height = 86;
      img.loading = 'lazy';
      img.addEventListener('error', function onError() {
        img.removeEventListener('error', onError);
        img.src = pathsApi.assetUrl('src/assets/images/placeholder.svg');
      });
      media.appendChild(img);
      var qty = el('span', 'order-line__qty', String(item.quantity));
      qty.setAttribute('aria-hidden', 'true');
      media.appendChild(qty);

      var info = el('span', 'order-line__info');
      info.appendChild(el('span', 'order-line__name', item.name));
      var meta = [item.color, item.size].filter(Boolean).join(' · ');
      info.appendChild(el('span', 'order-line__meta',
        (meta ? meta + ' · ' : '') + 'Qty ' + item.quantity + ' × ' + formatApi.money(item.price)));

      var total = el('span', 'order-line__total', formatApi.money(item.price * item.quantity));

      li.append(media, info, total);
      listEl.appendChild(li);
    });
  }

  function addRow(dl, label, value, className) {
    var row = el('div', 'order-totals__row' + (className ? ' ' + className : ''));
    row.append(el('dt', '', label), el('dd', '', value));
    dl.appendChild(row);
  }

  function renderTotals(dl, totals, deliveryMethodId) {
    dl.innerHTML = '';
    var method = ordersApi.DELIVERY_METHODS[deliveryMethodId];
    addRow(dl, 'Subtotal', formatApi.money(totals.subtotal));
    if (totals.discount > 0) addRow(dl, 'Discount (10%)', '−' + formatApi.money(totals.discount), 'is-discount');
    addRow(dl, method ? method.label : 'Delivery', totals.delivery ? formatApi.money(totals.delivery) : 'Free');
    addRow(dl, 'Total', formatApi.money(totals.total), 'is-total');
  }

  function badge(text, variant) {
    return el('span', 'badge' + (variant ? ' badge--' + variant : ''), text);
  }

  function orderStatusBadge(statusId) {
    return badge(ordersApi.statusLabel(statusId), statusId === 'delivered' ? 'success' : 'neutral');
  }

  function paymentStatusBadge(statusId) {
    return badge(ordersApi.PAYMENT_STATUSES[statusId] || '', statusId === 'paid' ? 'success' : 'warning');
  }

  // Completed steps get a check, the current step is highlighted with
  // aria-current="step", future steps stay neutral.
  function renderTimeline(listEl, statusId) {
    listEl.innerHTML = '';
    var currentIndex = ordersApi.ORDER_STATUSES.findIndex(function (s) { return s.id === statusId; });
    ordersApi.ORDER_STATUSES.forEach(function (status, index) {
      var state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming';
      var li = el('li', 'status-step status-step--' + state);
      if (state === 'current') li.setAttribute('aria-current', 'step');
      var marker = el('span', 'status-step__marker');
      marker.setAttribute('aria-hidden', 'true');
      if (state === 'done') marker.textContent = '✓';
      var label = el('span', 'status-step__label', status.label);
      var hint = el('span', 'visually-hidden',
        state === 'done' ? ' (completed)' : state === 'current' ? ' (current status)' : ' (upcoming)');
      label.appendChild(hint);
      li.append(marker, label);
      listEl.appendChild(li);
    });
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.orderView = {
    el: el,
    renderLines: renderLines,
    renderTotals: renderTotals,
    orderStatusBadge: orderStatusBadge,
    paymentStatusBadge: paymentStatusBadge,
    renderTimeline: renderTimeline,
  };
})();
