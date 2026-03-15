import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="switcher-container">
      <button
        class="switcher-toggle"
        (click)="toggleDropdown()"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="flag">{{ currentFlag() }}</span>
        @if (isExpanded()) {
        <span class="nav-text">{{ currentLangName() }}</span>
        }
        <svg
          class="chevron"
          [class.open]="isOpen()"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      @if (isOpen()) {
      <ul class="dropdown-menu">
        @for (lang of languages; track lang.code) {
        <li>
          <a
            [href]="getLanguageUrl(lang.langPath)"
            class="lang-item"
            [class.active]="lang.code === currentLangCode()"
          >
            <span class="flag">{{ lang.flag }}</span>
            <span class="lang-name">{{ lang.name }}</span>
          </a>
        </li>
        }
      </ul>
      }
    </div>
  `,
  styles: [
    `
      .switcher-container {
        position: relative;
        width: 100%;
      }

      .switcher-toggle {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 12px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 8px;
      }

      .switcher-toggle:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
      }

      .flag {
        font-size: 1.2rem;
        line-height: 1;
      }

      .nav-text {
        flex: 1;
        text-align: left;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .chevron {
        transition: transform 0.2s ease;
      }

      .chevron.open {
        transform: rotate(180deg);
      }

      .dropdown-menu {
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        margin-bottom: 8px;
        padding: 8px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        list-style: none;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        z-index: 100;
      }

      .lang-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        text-decoration: none;
        color: var(--text-secondary);
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 0.85rem;
      }

      .lang-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
      }

      .lang-item.active {
        color: var(--accent-primary);
        background: rgba(102, 126, 234, 0.1);
      }

      .lang-name {
        font-weight: 500;
      }
    `,
  ],
  imports: [CommonModule],
})
export class LanguageSwitcherComponent {
  isExpanded = input(true);
  isOpen = signal(false);

  languages = [
    { code: 'en-GB', name: 'English', flag: '🇬🇧', langPath: '' },
    { code: 'fo', name: 'Føroyskt', flag: '🇫🇴', langPath: 'fo/' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰', langPath: 'da/' },
  ];

  toggleDropdown() {
    this.isOpen.update((v) => !v);
  }

  currentLangCode() {
    return (
      (window as unknown as Record<string, string>)['LOCALE_ID'] || 'en-GB'
    );
  }

  getLanguageUrl(targetLangPath: string): string {
    const origin = window.location.origin;
    const pathname = window.location.pathname;

    // Detect the repository base path (e.g., "/mypage/")
    const segments = pathname.split('/').filter(s => s.length > 0);
    
    // Check if we are in a subdirectory (GitHub Pages setup)
    const knownLangs = ['fo', 'da'];
    let langIndex = -1;

    for (let i = 0; i < segments.length; i++) {
        if (knownLangs.includes(segments[i])) {
            langIndex = i;
            break;
        }
    }

    let repoName = '';
    let routeSegments: string[] = [];

    if (langIndex !== -1) {
        // We found a language segment (e.g., /mypage/fo/about)
        // Repo name is everything before the lang segment
        repoName = segments.slice(0, langIndex).join('/');
        // Route is everything after
        routeSegments = segments.slice(langIndex + 1);
    } else {
        // We are on the default language (e.g., /mypage/about)
        const knownRoutes = ['about'];
        const lastSegments = segments.filter(s => knownRoutes.includes(s));
        
        if (lastSegments.length > 0) {
            const firstRouteIndex = segments.indexOf(lastSegments[0]);
            repoName = segments.slice(0, firstRouteIndex).join('/');
            routeSegments = segments.slice(firstRouteIndex);
        } else {
            // Probably at root /mypage/
            repoName = segments.join('/');
            routeSegments = [];
        }
    }

    const repoPrefix = repoName ? `/${repoName}/` : '/';
    const routeSuffix = routeSegments.length > 0 ? routeSegments.join('/') : '';
    
    return `${origin}${repoPrefix}${targetLangPath}${routeSuffix}`;
  }

  currentLang() {
    const code = this.currentLangCode();
    return (
      this.languages.find((l) =>
        code.toLowerCase().startsWith(l.code.toLowerCase().split('-')[0])
      ) || this.languages[0]
    );
  }

  currentFlag() {
    return this.currentLang().flag;
  }

  currentLangName() {
    return this.currentLang().name;
  }
}
