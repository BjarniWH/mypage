import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('ctaBtn') private ctaBtn!: ElementRef<HTMLButtonElement>;

  private readonly destroyRef = inject(DestroyRef);
  private readonly floatingTimelines = new Map<
    HTMLElement,
    gsap.core.Timeline
  >();

  ngOnInit(): void {
    this.animateHero();
  }

  ngAfterViewInit(): void {
    this.setupButtonHover();
    this.setupCardHover();
  }

  private animateHero(): void {
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 30 },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    );

    gsap.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 30 },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 0.2,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    );

    // Same entrance as title/subtitle. clearProps cleans up inline transform
    // so GSAP hover can take over cleanly.
    gsap.fromTo(
      '.cta-button',
      { opacity: 0, y: 30 },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        delay: 0.4,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    );

    const timelines: gsap.core.Timeline[] = [];
    gsap.utils.toArray<HTMLElement>('.floating-card').forEach((card, i) => {
      const tl = gsap.timeline({ repeat: -1, delay: i * 0.6 });
      tl.to(card, { duration: 1.5, y: -20, ease: 'sine.inOut' }).to(card, {
        duration: 1.5,
        y: 0,
        ease: 'sine.inOut',
      });
      timelines.push(tl);
      this.floatingTimelines.set(card, tl);
    });

    this.destroyRef.onDestroy(() => timelines.forEach((tl) => tl.kill()));
  }

  private setupCardHover(): void {
    const cleanupFns: (() => void)[] = [];

    this.floatingTimelines.forEach((tl, card) => {
      const initialShadow = getComputedStyle(card).boxShadow;

      const onEnter = () => {
        tl.pause();
        gsap.to(card, {
          scale: 1.05,
          transformOrigin: 'center center',
          boxShadow: '0 28px 56px rgba(0, 0, 0, 0.55)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };
      const onLeave = () => {
        gsap.to(card, {
          scale: 1,
          transformOrigin: 'center center',
          boxShadow: initialShadow,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => tl.restart(),
        });
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      cleanupFns.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    this.destroyRef.onDestroy(() => cleanupFns.forEach((fn) => fn()));
  }

  private setupButtonHover(): void {
    const btn = this.ctaBtn.nativeElement;

    const onEnter = () =>
      gsap.to(btn, {
        y: -3,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    const onLeave = () =>
      gsap.to(btn, {
        y: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    const onDown = () =>
      gsap.to(btn, { y: -1, duration: 0.1, overwrite: 'auto' });

    btn.addEventListener('mouseenter', onEnter);
    btn.addEventListener('mouseleave', onLeave);
    btn.addEventListener('mousedown', onDown);

    this.destroyRef.onDestroy(() => {
      btn.removeEventListener('mouseenter', onEnter);
      btn.removeEventListener('mouseleave', onLeave);
      btn.removeEventListener('mousedown', onDown);
    });
  }
}
