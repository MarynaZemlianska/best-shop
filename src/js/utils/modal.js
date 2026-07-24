/**
 * Generic modal helpers used by the login modal, the cart "clear/checkout"
 * dialogs and any future overlay: Escape to close, click on the backdrop to
 * close, and page-scroll locking while at least one modal is open.
 */
(function () {
  var lockCount = 0;

  function lockScroll() {
    lockCount += 1;
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) document.body.style.overflow = '';
  }

  function openModal(modalEl, options) {
    if (!modalEl) return;
    options = options || {};
    modalEl.classList.add('is-open');
    modalEl.style.display = 'flex';
    modalEl.setAttribute('aria-hidden', 'false');
    lockScroll();

    function onKeydown(e) {
      if (e.key === 'Escape') closeModal(modalEl);
    }
    function onBackdrop(e) {
      if (e.target === modalEl) closeModal(modalEl);
    }

    modalEl._bsKeydown = onKeydown;
    modalEl._bsBackdrop = onBackdrop;
    document.addEventListener('keydown', onKeydown);
    modalEl.addEventListener('click', onBackdrop);

    var focusTarget = modalEl.querySelector('[data-autofocus]') ||
      modalEl.querySelector('input, button, textarea, select');
    if (focusTarget) focusTarget.focus();
    if (typeof options.onOpen === 'function') options.onOpen();
  }

  function closeModal(modalEl, options) {
    if (!modalEl || !modalEl.classList.contains('is-open')) return;
    options = options || {};
    modalEl.classList.remove('is-open');
    modalEl.style.display = 'none';
    modalEl.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if (modalEl._bsKeydown) document.removeEventListener('keydown', modalEl._bsKeydown);
    if (modalEl._bsBackdrop) modalEl.removeEventListener('click', modalEl._bsBackdrop);
    if (typeof options.onClose === 'function') options.onClose();
  }

  function confirmDialog(message, onConfirm) {
    var modal = document.getElementById('bsConfirmModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bsConfirmModal';
      modal.className = 'modal-overlay confirm-modal';
      modal.setAttribute('aria-hidden', 'true');

      var box = document.createElement('div');
      box.className = 'modal-box';
      box.setAttribute('role', 'alertdialog');
      box.setAttribute('aria-modal', 'true');

      var messageEl = document.createElement('p');
      messageEl.className = 'confirm-message';

      var actions = document.createElement('div');
      actions.className = 'confirm-actions';

      var cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-outline';
      cancelBtn.dataset.action = 'cancel';
      cancelBtn.textContent = 'Cancel';

      var confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn';
      confirmBtn.dataset.action = 'confirm';
      confirmBtn.textContent = 'Confirm';

      actions.append(cancelBtn, confirmBtn);
      box.append(messageEl, actions);
      modal.appendChild(box);
      document.body.appendChild(modal);
    }

    modal.querySelector('.confirm-message').textContent = message;
    var confirmBtn = modal.querySelector('[data-action="confirm"]');
    var cancelBtn = modal.querySelector('[data-action="cancel"]');

    function cleanup() {
      confirmBtn.removeEventListener('click', onConfirmClick);
      cancelBtn.removeEventListener('click', onCancelClick);
      closeModal(modal);
    }
    function onConfirmClick() {
      cleanup();
      onConfirm();
    }
    function onCancelClick() {
      cleanup();
    }

    confirmBtn.addEventListener('click', onConfirmClick);
    cancelBtn.addEventListener('click', onCancelClick);
    openModal(modal);
  }

  window.BestShop = window.BestShop || {};
  window.BestShop.modal = {
    openModal: openModal,
    closeModal: closeModal,
    confirmDialog: confirmDialog,
    lockScroll: lockScroll,
    unlockScroll: unlockScroll,
  };
})();
