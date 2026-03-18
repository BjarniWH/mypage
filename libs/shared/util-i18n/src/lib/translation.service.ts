import { Injectable, signal, computed, inject, LOCALE_ID } from '@angular/core';

export type TranslationKeys = typeof import('./en/common.json');

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLocale = inject(LOCALE_ID);
  private translationsSignal = signal<TranslationKeys | null>(null);

  // Expose the translations as a computed signal for easy consumption
  readonly t = computed(() => this.translationsSignal()!);

  /**
   * Loads the translations for the specified locale.
   * Defaults to English if loading fails.
   */
  async loadTranslations(locale: string = this.currentLocale): Promise<void> {
    try {
      let data: TranslationKeys;
      
      // Dynamic imports for the locales
      switch (locale.split('-')[0]) {
        case 'da':
          data = await import('./da/common.json') as unknown as TranslationKeys;
          break;
        case 'fo':
          data = await import('./fo/common.json') as unknown as TranslationKeys;
          break;
        default:
          data = await import('./en/common.json') as unknown as TranslationKeys;
          break;
      }
      
      this.translationsSignal.set(data);
    } catch (error) {
      console.error(`Failed to load translations for ${locale}, falling back to English`, error);
      const fallback = await import('./en/common.json') as unknown as TranslationKeys;
      this.translationsSignal.set(fallback);
    }
  }
}
