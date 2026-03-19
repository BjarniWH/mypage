const fs = require('fs');
const path = require('path');

const libPath = path.join(__dirname, '../../libs/shared/util-i18n/src/lib');
const locales = ['en', 'da', 'fo'];
const baseLocale = 'en';

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function checkI18n() {
  const baseFile = path.join(libPath, baseLocale, 'common.json');
  if (!fs.existsSync(baseFile)) {
    console.error(`Base locale file not found: ${baseFile}`);
    process.exit(1);
  }

  const baseContent = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
  const baseKeys = getKeys(baseContent).sort();
  let hasError = false;

  locales.filter(l => l !== baseLocale).forEach(locale => {
    const localeFile = path.join(libPath, locale, 'common.json');
    if (!fs.existsSync(localeFile)) {
      console.error(`Locale file missing: ${localeFile}`);
      hasError = true;
      return;
    }

    const content = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    const keys = getKeys(content).sort();

    const missing = baseKeys.filter(k => !keys.includes(k));
    const extra = keys.filter(k => !baseKeys.includes(k));

    if (missing.length > 0) {
      console.error(`\x1b[31m[ERROR]\x1b[0m Locale "${locale}" is missing keys:`, missing);
      hasError = true;
    }
    if (extra.length > 0) {
      console.error(`\x1b[33m[WARNING]\x1b[0m Locale "${locale}" has extra keys:`, extra);
      // We don't necessarily want to fail for extra keys, but it's good to know.
    }
  });

  if (hasError) {
    console.error('\x1b[31mTranslation validation failed.\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32mAll translations are synchronized!\x1b[0m');
  }
}

checkI18n();
