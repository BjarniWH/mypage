import { Component, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  template: `
    <div class="switcher-container">
      <button class="switcher-toggle" (click)="toggleDropdown()" [attr.aria-expanded]="isOpen()">
        <span class="flag">{{ currentFlag() }}</span>
        @if (isExpanded()) {
          <span class="nav-text">{{ currentLangName() }}</span>
        }
        <svg class="chevron" [class.open]="isOpen()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      @if (isOpen()) {
        <ul class="dropdown-menu">
          @for (lang of languages; track lang.code) {
            <li>
              <a [href]="lang.url" class="lang-item" [class.active]="lang.code === currentLangCode()">
                <span class="flag">{{ lang.flag }}</span>
                <span class="lang-name">{{ lang.name }}</span>
              </a>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
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
  `],
  imports: [CommonModule]
})
export class LanguageSwitcherComponent {
  isExpanded = input(true);
  isOpen = signal(false);

  languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸', url: '/' },
    { code: 'fo', name: 'Føroyskt', flag: '🇫🇴', url: '/fo/' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰', url: '/da/' }
  ];

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  currentLangCode() {
    return (window as unknown as Record<string, string>)['LOCALE_ID'] || 'en-US';
  }

  currentLang() {
    return this.languages.find(l => this.currentLangCode().startsWith(l.code.split('-')[0])) || this.languages[0];
  }

  currentFlag() {
    return this.currentLang().flag;
  }

  currentLangName() {
    return this.currentLang().name;
  }
}
