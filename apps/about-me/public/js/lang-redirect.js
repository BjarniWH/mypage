(function () {
  if (/localhost|127.0.0.1/.test(window.location.hostname)) return;

  const path = window.location.pathname;
  const supportedLangs = ['da', 'fo'];

  // 1. Check if we are already in a language folder
  // This regex looks for /da/ or /fo/ in the URL
  const isLocalized = supportedLangs.some((lang) => path.includes(`/${lang}/`));
  if (isLocalized) return;

  // 2. Detect Browser Language
  const userLang = (navigator.language || 'en').split('-')[0];

  if (supportedLangs.includes(userLang)) {
    // 3. Simple Redirect: Just insert the language code
    // If path is /repo/ it becomes /repo/da/
    // If path is /repo/about it becomes /repo/da/about
    const newPath = path.endsWith('/')
      ? `${path}${userLang}/`
      : `${path}/${userLang}/`;
    window.location.href = newPath;
  }
})();
