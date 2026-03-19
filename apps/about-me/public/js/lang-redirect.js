(function () {
  // 1. Skip for local development
  if (/localhost|127.0.0.1/.test(window.location.hostname)) return;

  const path = window.location.pathname;
  const supportedLangs = ['da', 'fo'];

  // 2. Check if we've already done a redirect check this session
  // This prevents the "once you go English, you stay English" bug
  if (sessionStorage.getItem('lang-redirected')) return;

  // 3. Check if we are already in a localized subfolder
  const isLocalized = supportedLangs.some(
    (lang) => path.includes(`/${lang}/`) || path.endsWith(`/${lang}`),
  );

  if (isLocalized) {
    sessionStorage.setItem('lang-redirected', 'true');
    return;
  }

  // 4. Detect Browser Language
  const userLang = (navigator.language || 'en').split('-')[0];

  if (supportedLangs.includes(userLang)) {
    // Mark as redirected BEFORE moving to prevent race conditions
    sessionStorage.setItem('lang-redirected', 'true');

    // 5. Construct the new path
    // Handles /repo/ -> /repo/da/ or /repo/about -> /repo/da/about
    const newPath = path.endsWith('/')
      ? `${path}${userLang}/`
      : `${path}/${userLang}/`;

    window.location.href = newPath;
  } else {
    // If language is not supported (e.g., English), still mark as checked
    sessionStorage.setItem('lang-redirected', 'true');
  }
})();
