/**
 * Small non-blocking notification (e.g. "Added to cart"). One live region is
 * reused for every message so screen readers announce it politely; the toast
 * hides itself after a few seconds, but stays while hovered or focused.
 */
(function () {
  var HIDE_AFTER = 4000;
  var region = null;
  var hideTimer = null;

  function ensureRegion() {
    if (region) return region;
    region = document.createElement('div');
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
    return region;
  }

  function hide() {
    if (!region) return;
    var toast = region.querySelector('.toast');
    if (toast) toast.classList.remove('is-visible');
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_AFTER);
  }

  function show(options) {
    var container = ensureRegion();
    container.innerHTML = '';

    var toast = document.createElement('div');
    toast.className = 'toast';

    var text = document.createElement('div');
    text.className = 'toast__text';
    var title = document.createElement('p');
    title.className = 'toast__title';
    title.textContent = options.title || '';
    text.appendChild(title);
    if (options.message) {
      var message = document.createElement('p');
      message.className = 'toast__message';
      message.textContent = options.message;
      text.appendChild(message);
    }
    toast.appendChild(text);

    if (options.actionHref) {
      var action = document.createElement('a');
      action.className = 'toast__action';
      action.href = options.actionHref;
      action.textContent = options.actionLabel || 'Open';
      toast.appendChild(action);
    }

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'toast__close';
    close.setAttribute('aria-label', 'Dismiss notification');
    close.textContent = '×';
    close.addEventListener('click', hide);
    toast.appendChild(close);

    toast.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    toast.addEventListener('mouseleave', scheduleHide);
    toast.addEventListener('focusin', function () { clearTimeout(hideTimer); });
    toast.addEventListener('focusout', scheduleHide);

    container.appendChild(toast);
    // Next frame so the enter transition runs.
    requestAnimationFrame(function () { toast.classList.add('is-visible'); });
    scheduleHide();
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.toast = { show: show, hide: hide };
})();
