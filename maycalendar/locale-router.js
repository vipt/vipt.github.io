/* Shared by the entry page and direct language pages. No network lookup needed. */
(function () {
  'use strict';
  const supported = ['ja','en','ar','de','es','fi','fr','hi','id','it','ko','nl','pl','pt-BR','ru','th','tr','vi','zh-Hans','zh-Hant','zh-Hant-HK','zh-Hant-TW'];
  const key = 'may-calendar-language';
  function matchLanguage(value) {
    if (typeof value !== 'string') return null;
    const tag = value.trim().replace(/_/g,'-').toLowerCase();
    if (!/^[a-z]{2,3}(?:-[a-z0-9]{1,8})*$/.test(tag)) return null;
    const exact = supported.find(code => code.toLowerCase() === tag);
    if (exact) return exact;
    const allParts = tag.split('-');
    const extension = allParts.findIndex((part,index) => index > 0 && part.length === 1);
    const parts = extension < 0 ? allParts : allParts.slice(0,extension), language = parts[0];
    if (language === 'zh') {
      // Explicit script wins over region (for example zh-Hans-TW stays simplified).
      if (parts.includes('hans')) return 'zh-Hans';
      if (parts.includes('hant')) {
        if (parts.includes('hk') || parts.includes('mo')) return 'zh-Hant-HK';
        if (parts.includes('tw')) return 'zh-Hant-TW';
        return 'zh-Hant';
      }
      if (parts.includes('hk') || parts.includes('mo')) return 'zh-Hant-HK';
      if (parts.includes('tw')) return 'zh-Hant-TW';
      return 'zh-Hans';
    }
    if (language === 'pt') return 'pt-BR';
    return supported.includes(language) ? language : null;
  }
  function chooseLanguage(saved, languages) {
    const preference = matchLanguage(saved);
    if (preference) return preference;
    for (const value of Array.isArray(languages) ? languages : []) {
      const match = matchLanguage(value);
      if (match) return match;
    }
    return 'en';
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {supported,matchLanguage,chooseLanguage};
  if (typeof document === 'undefined') return;
  // The script URL is the root of this site, including when hosted in a subdirectory.
  const base = new URL('.', document.currentScript.src);
  const storageKey = `${key}:${base.pathname}`;
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-locale]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    try { localStorage.setItem(storageKey,link.dataset.locale); } catch { /* Private mode or blocked storage: navigation still works. */ }
  });
  if (document.documentElement.dataset.autoLocale !== 'true') return;
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch { /* Browser preferences remain available. */ }
  const url = new URL(location.href);
  const explicit = matchLanguage(url.searchParams.get('lang'));
  const selected = explicit || chooseLanguage(saved, navigator.languages?.length ? navigator.languages : [navigator.language]);
  const destination = new URL(`${selected}/index.html`,base);
  url.searchParams.delete('lang');
  destination.search = url.search;
  destination.hash = url.hash;
  location.replace(destination.href);
})();
