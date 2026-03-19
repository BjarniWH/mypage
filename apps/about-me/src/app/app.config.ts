import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { APP_INITIALIZER, LOCALE_ID, inject } from '@angular/core';
import { TranslationService } from '@org/shared/util-i18n';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const path = window.location.pathname;
        if (path.startsWith('/fo/')) return 'fo';
        if (path.startsWith('/da/')) return 'da';
        return 'en';
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const translationService = inject(TranslationService);
        const localeId = inject(LOCALE_ID);
        return () => translationService.loadTranslations(localeId);
      },
      multi: true
    }
  ]
};
