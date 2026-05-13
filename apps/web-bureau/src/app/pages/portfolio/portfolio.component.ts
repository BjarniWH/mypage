import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
  DestroyRef,
} from '@angular/core';
import { gsap } from 'gsap';

interface Project {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly color: string;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  @ViewChildren('portfolioItem') private itemRefs!: QueryList<ElementRef<HTMLElement>>;

  private readonly destroyRef = inject(DestroyRef);

  readonly projects: readonly Project[] = [
    {
      title: 'Modern E-Commerce Platform',
      description:
        'A sleek and responsive e-commerce solution with stunning animations',
      tags: ['Design', 'Development', 'Animation'],
      color: 'linear-gradient(135deg, #5ba4cf 0%, #7ecfe4 100%)',
    },
    {
      title: 'Brand Identity System',
      description:
        'Complete branding package including logo, guidelines, and digital assets',
      tags: ['Branding', 'Design', 'Guidelines'],
      color: 'linear-gradient(135deg, #3d8ab8 0%, #5ba4cf 100%)',
    },
    {
      title: 'Mobile App Experience',
      description: 'User-centric mobile application with smooth interactions',
      tags: ['UI/UX', 'Development', 'Mobile'],
      color: 'linear-gradient(135deg, #7ecfe4 0%, #a8e4f0 100%)',
    },
    {
      title: 'Corporate Website',
      description:
        'Professional website showcasing company services and expertise',
      tags: ['Web', 'Design', 'SEO'],
      color: 'linear-gradient(135deg, #4a90b8 0%, #7ecfe4 100%)',
    },
    {
      title: 'Digital Marketing Campaign',
      description: 'Integrated campaign with web, social, and print elements',
      tags: ['Marketing', 'Design', 'Strategy'],
      color: 'linear-gradient(135deg, #5ba4cf 0%, #3d8ab8 100%)',
    },
    {
      title: 'Interactive Dashboard',
      description:
        'Real-time data visualization with beautiful and functional design',
      tags: ['Development', 'Data', 'UI'],
      color: 'linear-gradient(135deg, #2d7aaa 0%, #5ba4cf 100%)',
    },
  ];

  ngOnInit(): void {
    gsap.fromTo(
      '.portfolio-item',
      { opacity: 0 },
      { duration: 0.8, opacity: 1, stagger: 0.15, ease: 'power2.out' }
    );
  }

  ngAfterViewInit(): void {
    this.setupHover();
  }

  private setupHover(): void {
    const cleanupFns: (() => void)[] = [];

    this.itemRefs.forEach(({ nativeElement: item }) => {
      const onEnter = () => {
        gsap.to(item, { y: -12, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      };
      const onLeave = () => {
        gsap.to(item, { y: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      };

      item.addEventListener('mouseenter', onEnter);
      item.addEventListener('mouseleave', onLeave);
      cleanupFns.push(() => {
        item.removeEventListener('mouseenter', onEnter);
        item.removeEventListener('mouseleave', onLeave);
      });
    });

    this.destroyRef.onDestroy(() => cleanupFns.forEach((fn) => fn()));
  }
}
