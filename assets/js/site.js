/* Progressive navigation, theme and back-to-top controls. */
(function () {
  'use strict';

  var THEME_KEY = 'nosia-theme';
  var root = document.documentElement;
  var explicitTheme = false;
  try {
    var stored = localStorage.getItem(THEME_KEY);
    explicitTheme = stored === 'dark' || stored === 'light';
  } catch (error) {}

  function initTheme() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    function sync(dark) {
      root.classList.toggle('dark', dark);
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(dark)); });
    }
    buttons.forEach(function (button) {
      button.hidden = false;
      button.addEventListener('click', function () {
        var dark = !root.classList.contains('dark');
        explicitTheme = true;
        sync(dark);
        try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch (error) {}
      });
    });
    sync(root.classList.contains('dark'));
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
        if (!explicitTheme) sync(event.matches);
      });
    }
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.getElementById('primary-nav');
    var header = document.querySelector('.header');
    if (!button || !nav || !header) return;
    var mobile = window.matchMedia('(max-width: 1100px)');
    var lastFocused = document.activeElement;
    function setOpen(open, restoreFocus) {
      header.setAttribute('data-menu-open', String(open));
      button.setAttribute('aria-expanded', String(open));
      if (restoreFocus) button.focus();
    }
    button.hidden = false;
    setOpen(false);
    root.classList.add('menu-ready');
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
      if (open) nav.querySelector('a').focus();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setOpen(false, true);
      }
    });
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (!link || !mobile.matches) return;
      setOpen(false);
      var url = new URL(link.href);
      if (url.pathname === location.pathname && url.hash) {
        var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
    document.addEventListener('focusin', function (event) {
      lastFocused = event.target;
      if (!header.contains(event.target)) setOpen(false);
    });
    mobile.addEventListener('change', function () {
      var previous = lastFocused;
      setOpen(false);
      if (mobile.matches && nav.contains(previous)) button.focus();
      else if (!mobile.matches && previous === button) nav.querySelector('a').focus();
    });
  }

  function initCopy() {
    document.querySelectorAll('[data-copy-target]').forEach(function (button) {
      var command = document.getElementById(button.getAttribute('data-copy-target'));
      var block = button.closest('[data-command]');
      if (!command || !block) return;
      var status = block.querySelector('[data-copy-status]');
      if (!status) return;
      button.hidden = false;
      button.addEventListener('click', async function () {
        button.disabled = true;
        status.textContent = '';
        try {
          if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(command.textContent);
          status.textContent = button.getAttribute('data-copy-success');
        } catch (error) {
          status.textContent = button.getAttribute('data-copy-error');
        } finally {
          button.disabled = false;
        }
      });
    });
  }

  function initBackToTop() {
    var button = document.querySelector('.back-to-top');
    if (!button) return;
    function update() {
      var visible = window.scrollY > 400;
      button.hidden = !visible;
      button.classList.toggle('visible', visible);
    }
    button.addEventListener('click', function (event) {
      event.preventDefault();
      document.getElementById('main-content').focus({ preventScroll: true });
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    initMenu();
    initTheme();
    initCopy();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
