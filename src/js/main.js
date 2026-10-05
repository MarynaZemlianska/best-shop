/**
 * Shared header behavior loaded on every page: mobile navigation, scroll
 * reveal and the active nav-item highlight. Every DOM lookup is guarded so a
 * page missing one of these elements never throws.
 */
(function () {
  var modalApi = window.BestShop.modal;

  function setupHamburger() {
    var hamburger = document.getElementById('hamburger');
    var mainNav = document.getElementById('mainNav') || document.querySelector('.main-nav');
    if (!hamburger || !mainNav) return;

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', mainNav.id || 'mainNav');

    function onKeydown(e) {
      if (e.key !== 'Escape') return;
      closeMenu();
      hamburger.focus();
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

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Leaving the compact header layout with the menu open would keep the
    // page scroll-locked. Must match respond(tablet) in header.scss.
    var mobileQuery = window.matchMedia('(max-width: 1024px)');
    var onBreakpointChange = function (e) {
      if (!e.matches) closeMenu();
    };
    if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', onBreakpointChange);
    else if (mobileQuery.addListener) mobileQuery.addListener(onBreakpointChange);
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
    document.querySelectorAll('.nav-item[href], .account-icon[href]').forEach(function (link) {
      var page = (link.getAttribute('href') || '').split('/').pop();
      var isCurrent = page === current;
      link.classList.toggle('active', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHamburger();
    setActiveNav();
    setupScrollReveal();
  });
})();
