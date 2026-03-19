import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslationService } from '@org/shared/util-i18n';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
  private translationService = inject(TranslationService);
  t = this.translationService.t;
}
