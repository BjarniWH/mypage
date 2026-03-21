import {
  Component,
  signal,
  input,
  HostListener,
  ElementRef,
  inject,
  LOCALE_ID,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="switcher-container">
      <button
        class="switcher-toggle"
        (click)="toggleDropdown($event)"
        [attr.aria-expanded]="isOpen()"
      >
        <span class="flag" [class]="currentFlag()"></span>
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
                <span class="flag" [class]="lang.flag"></span>
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
        outline: none;
      }

      .switcher-toggle:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
      }

      .flag {
        font-size: 1.2rem;
        line-height: 1;
        flex-shrink: 0;
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
        flex-shrink: 0;
      }

      .chevron.open {
        transform: rotate(180deg);
      }

      .dropdown-menu {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 0;
        width: 216px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(0, 0, 0, 0.05);
        border-radius: 12px;
        list-style: none;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(15px);
        z-index: 1000;
        margin: 0;
        animation: slideUp 0.2s ease-out;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .lang-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        text-decoration: none;
        color: #555;
        border-radius: 8px;
        transition: all 0.2s ease;
        font-size: 0.85rem;
      }

      .lang-item:hover {
        background: rgba(118, 75, 162, 0.05);
        color: #764ba2;
      }

      .lang-item.active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
        font-weight: 600;
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
  private elementRef = inject(ElementRef);
  private localeId = inject(LOCALE_ID);

  languages = [
    { code: 'en-GB', name: 'English', flag: 'fi fi-gb', langPath: '' },
    { code: 'fo', name: 'Føroyskt', flag: 'fi fi-fo', langPath: 'fo/' },
    { code: 'da', name: 'Dansk', flag: 'fi fi-dk', langPath: 'da/' },
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen.update((v) => !v);
  }

  currentLangCode() {
    const path = window.location.pathname;

    // 1. Check URL segments (Standard build structure: /repo/da/about)
    const segments = path.split('/').filter(Boolean);
    if (segments.includes('da')) return 'da';
    if (segments.includes('fo')) return 'fo';

    // 2. Fallback to the injected LOCALE_ID from Angular
    return this.localeId;
  }

  getLanguageUrl(targetLangPath: string): string {
    const origin = window.location.origin;
    const pathname = window.location.pathname;

    const segments = pathname.split('/').filter((s) => s.length > 0);
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
      repoName = segments.slice(0, langIndex).join('/');
      routeSegments = segments.slice(langIndex + 1);
    } else {
      const knownRoutes = ['about'];
      const lastSegments = segments.filter((s) => knownRoutes.includes(s));

      if (lastSegments.length > 0) {
        const firstRouteIndex = segments.indexOf(lastSegments[0]);
        repoName = segments.slice(0, firstRouteIndex).join('/');
        routeSegments = segments.slice(firstRouteIndex);
      } else {
        repoName = segments.join('/');
        routeSegments = [];
      }
    }

    const repoPrefix = repoName ? `/${repoName}/` : '/';
    const routeSuffix = routeSegments.length > 0 ? routeSegments.join('/') : '';

    return `${origin}${repoPrefix}${targetLangPath}${routeSuffix}`;
  }

  currentLang() {
    const code = this.currentLangCode().toLowerCase();
    // Find match by code or by the start of the code (e.g., 'en' matches 'en-GB')
    const match = this.languages.find((l) =>
      code.startsWith(l.code.toLowerCase().split('-')[0]),
    );
    return match || this.languages[0]; // Always return English as absolute fallback
  }

  currentFlag() {
    return this.currentLang().flag;
  }

  currentLangName() {
    return this.currentLang().name;
  }
}
