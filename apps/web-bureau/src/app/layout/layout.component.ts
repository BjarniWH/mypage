import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule],
  template: `
    <div class="app-wrapper" [class.dark-mode]="themeService.theme() === 'dark'">
      <nav class="navbar">
        <div class="navbar-container">
          <div class="navbar-brand">
            <h2>Bureau</h2>
          </div>
          <ul class="nav-links">
            <li>
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                Home
              </a>
            </li>
            <li>
              <a routerLink="/about" routerLinkActive="active">About</a>
            </li>
            <li>
              <a routerLink="/portfolio" routerLinkActive="active">Portfolio</a>
            </li>
            <li>
              <a routerLink="/contact" routerLinkActive="active">Contact</a>
            </li>
          </ul>
          <button class="theme-toggle" (click)="themeService.toggleTheme()" [attr.aria-label]="'Switch to ' + (themeService.theme() === 'light' ? 'dark' : 'light') + ' mode'">
            {{ themeService.theme() === 'light' ? '🌙' : '☀️' }}
          </button>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <p>&copy; 2024 Our Bureau. All rights reserved.</p>
          <div class="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  themeService = inject(ThemeService);
}
