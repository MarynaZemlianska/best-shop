/**
 * Shared header behavior loaded on every page: mobile navigation, login
 * modal and the active nav-item highlight. Every DOM lookup is guarded so a
 * page missing one of these elements never throws.
 */
(function () {
  var modalApi = window.BestShop.modal;
  var pathsApi = window.BestShop.paths;

  function setupHamburger() {
    var hamburger = document.getElementById('hamburger');
    var mainNav = document.getElementById('mainNav') || document.querySelector('.main-nav');
    if (!hamburger || !mainNav) return;

    hamburger.setAttribute('role', 'button');
    hamburger.setAttribute('tabindex', '0');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');

    function onKeydown(e) {
      if (e.key === 'Escape') closeMenu();
    }
    function onOutsideClick(e) {
      if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    }

    function openMenu() {
      hamburger.classList.add('active');
      mainNav.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      modalApi.lockScroll();
      document.addEventListener('keydown', onKeydown);
      document.addEventListener('click', onOutsideClick, true);
    }

    function closeMenu() {
      if (!mainNav.classList.contains('active')) return;
      hamburger.classList.remove('active');
      mainNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      modalApi.unlockScroll();
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('click', onOutsideClick, true);
    }

    hamburger.addEventListener('click', function () {
      if (mainNav.classList.contains('active')) closeMenu();
      else openMenu();
    });
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
      }
    });

    mainNav.querySelectorAll('.nav-item').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  function showFieldError(input, errorEl, message) {
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.style.display = message ? 'block' : 'none';
    }
    if (input) input.classList.toggle('is-invalid', Boolean(message));
  }

  function getLoggedUser() {
    return localStorage.getItem('loggedUser') || sessionStorage.getItem('loggedUser');
  }

  function setUserBadge(userIcon, email) {
    userIcon.textContent = email.charAt(0).toUpperCase();
    userIcon.classList.add('logged-in');
    userIcon.setAttribute('aria-label', 'Account: ' + email + '. Click to log out.');
  }

  function resetUserBadge(userIcon) {
    userIcon.classList.remove('logged-in');
    userIcon.textContent = '';
    var img = document.createElement('img');
    img.src = pathsApi.assetUrl('src/assets/images/account.svg');
    img.alt = '';
    userIcon.appendChild(img);
    userIcon.setAttribute('aria-label', 'Log in');
  }

  function setupLogin() {
    var loginModal = document.getElementById('loginModal');
    var userIcon = document.querySelector('.account-icon');
    if (!loginModal || !userIcon) return;

    var closeBtn = loginModal.querySelector('.login-close');
    var loginForm = document.getElementById('loginForm');
    var togglePassword = document.getElementById('togglePassword');
    var passwordInput = document.getElementById('loginPassword');
    var emailInput = document.getElementById('loginEmail');
    var emailError = document.getElementById('loginEmailError');
    var passwordError = document.getElementById('loginPasswordError');

    userIcon.setAttribute('role', 'button');
    userIcon.setAttribute('tabindex', '0');

    var savedUser = getLoggedUser();
    if (savedUser) {
      setUserBadge(userIcon, savedUser);
    } else {
      userIcon.setAttribute('aria-label', 'Log in');
    }

    userIcon.addEventListener('click', function () {
      if (userIcon.classList.contains('logged-in')) {
        modalApi.confirmDialog('Log out of your account?', function () {
          localStorage.removeItem('loggedUser');
          sessionStorage.removeItem('loggedUser');
          resetUserBadge(userIcon);
        });
      } else {
        modalApi.openModal(loginModal);
      }
    });
    userIcon.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        userIcon.click();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () { modalApi.closeModal(loginModal); });
    }

    if (emailInput) emailInput.addEventListener('input', function () { showFieldError(emailInput, emailError, ''); });
    if (passwordInput) passwordInput.addEventListener('input', function () { showFieldError(passwordInput, passwordError, ''); });

    if (loginForm) {
      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = emailInput.value.trim();
        var password = passwordInput.value;
        var remember = loginForm.querySelector('input[name="remember"]');
        var emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
        var valid = true;

        if (!emailPattern.test(email)) {
          showFieldError(emailInput, emailError, 'Enter a valid email address.');
          valid = false;
        } else {
          showFieldError(emailInput, emailError, '');
        }

        if (!password) {
          showFieldError(passwordInput, passwordError, 'Password is required.');
          valid = false;
        } else {
          showFieldError(passwordInput, passwordError, '');
        }

        if (!valid) return;

        var store = remember && remember.checked ? localStorage : sessionStorage;
        store.setItem('loggedUser', email);
        setUserBadge(userIcon, email);
        modalApi.closeModal(loginModal);
        loginForm.reset();
      });
    }

    if (togglePassword && passwordInput) {
      togglePassword.setAttribute('role', 'button');
      togglePassword.setAttribute('tabindex', '0');
      togglePassword.setAttribute('aria-label', 'Show password');
      togglePassword.addEventListener('click', function () {
        var willShow = passwordInput.type === 'password';
        passwordInput.type = willShow ? 'text' : 'password';
        togglePassword.setAttribute('aria-label', willShow ? 'Hide password' : 'Show password');
      });
    }
  }

  function setupScrollReveal() {
    var sections = document.querySelectorAll('main > section, main > .container, main > p');
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function (el) { el.classList.add('reveal', 'in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item[href]').forEach(function (link) {
      var page = (link.getAttribute('href') || '').split('/').pop();
      link.classList.toggle('active', page === current);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHamburger();
    setupLogin();
    setActiveNav();
  });
})();
