/**
 * Language Toggle for Nosia Website
 * Handles switching between French and English versions
 */
(function() {
  'use strict';

  const LANG_KEY = 'nosia-lang';
  const DEFAULT_LANG = 'fr';
  const SUPPORTED_LANGS = ['fr', 'en'];

  /**
   * Get current language from URL path or localStorage
   * @returns {string} Current language code
   */
  function getCurrentLang() {
    const path = window.location.pathname;
    if (path === '/en' || path === '/en/' || path.startsWith('/en/')) {
      return 'en';
    }
    return 'fr';
  }

  /**
   * Get the opposite language
   * @param {string} currentLang - Current language code
   * @returns {string} Opposite language code
   */
  function getOppositeLang(currentLang) {
    return currentLang === 'fr' ? 'en' : 'fr';
  }

  /**
   * Get the URL for a specific language
   * @param {string} lang - Language code
   * @returns {string} URL for the language
   */
  function getLangUrl(lang) {
    const origin = window.location.origin;
    let path = window.location.pathname;
    // Normalize: strip an existing /en prefix to get the FR-relative path.
    let frPath = path.replace(/^\/en(\/|$)/, '/');
    if (lang === 'en') {
      return origin + (frPath === '/' ? '/en/' : '/en' + frPath);
    }
    return origin + frPath;
  }

  /**
   * Switch to a different language
   * @param {string} lang - Language code to switch to
   */
  function switchLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      console.warn('Unsupported language:', lang);
      return;
    }
    
    // Save preference
    localStorage.setItem(LANG_KEY, lang);
    
    // Redirect to the appropriate page
    window.location.href = getLangUrl(lang);
  }

  /**
   * Initialize language toggle functionality
   */
  function init() {
    const currentLang = getCurrentLang();
    const oppositeLang = getOppositeLang(currentLang);
    
    // Find all language toggle buttons
    const toggleButtons = document.querySelectorAll('[data-lang-toggle]');
    
    toggleButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        switchLanguage(oppositeLang);
      });
    });
    
    // Update button text based on current language
    updateToggleButtons(currentLang);
    
    // Also apply language preference to HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  /**
   * Update toggle button text based on current language
   * @param {string} currentLang - Current language code
   */
  function updateToggleButtons(currentLang) {
    const oppositeLang = getOppositeLang(currentLang);
    const langNames = {
      fr: 'Français',
      en: 'English'
    };
    
    const toggleButtons = document.querySelectorAll('[data-lang-toggle]');
    toggleButtons.forEach(button => {
      const oppositeName = langNames[oppositeLang] || oppositeLang;
      button.textContent = oppositeName;
      button.setAttribute('aria-label', `Switch to ${oppositeName}`);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
