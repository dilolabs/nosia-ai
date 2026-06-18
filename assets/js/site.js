/**
 * Nosia website UI behaviors
 *  - Dark/light theme toggle (class-based `.dark`, persisted, no flash)
 *  - Back-to-top button visibility
 */
(function () {
  'use strict';

  var THEME_KEY = 'nosia-theme';
  var root = document.documentElement;

  /* ---- Theme toggle ---------------------------------------------------- */
  function currentTheme() {
    return root.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  function initTheme() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', currentTheme() === 'dark');
      btn.addEventListener('click', function () {
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', next === 'dark');
        });
      });
    });

    // Follow OS changes only while the user hasn't made an explicit choice.
    var stored;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!stored && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', function (e) {
          root.classList.toggle('dark', e.matches);
        });
    }
  }

  /* ---- Back to top ----------------------------------------------------- */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    function onScroll() {
      btn.classList.toggle('visible', window.scrollY > 400);
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function init() {
    initTheme();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
