(function () {
  // Local development doesn't need redirection logic
  if (/localhost|127.0.0.1/.test(window.location.hostname)) return;

  const pathname = window.location.pathname;
  const langChecked = localStorage.getItem('language-checked');

  // If we're already in a localized route or have checked, don't redirect
  if (langChecked || /^\/(fo|da)\//.test(pathname)) {
    localStorage.setItem('language-checked', 'true');
    return;
  }

  const userLang = (navigator.language || navigator.userLanguage || 'en').split(
    '-',
  )[0];
  const supportedLangs = ['fo', 'da'];

  // Fallback strategy: userLang -> en
  if (!supportedLangs.includes(userLang)) {
    localStorage.setItem('language-checked', 'true');
    return;
  }

  // Detection of route path for subdirectories (e.g. GitHub Pages)
  const segments = pathname.split('/').filter(Boolean);
  const knownRoutes = ['about'];
  const routeIndex = segments.findIndex((s) => knownRoutes.includes(s));

  const repoPath =
    routeIndex > -1
      ? segments.slice(0, routeIndex).join('/')
      : segments.join('/');
  const routePath = routeIndex > -1 ? segments.slice(routeIndex).join('/') : '';
  const prefix = repoPath ? `/${repoPath}/${userLang}/` : `/${userLang}/`;

  localStorage.setItem('language-checked', 'true');
  window.location.href = prefix + routePath;
})();
