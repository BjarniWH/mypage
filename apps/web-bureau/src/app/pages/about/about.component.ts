import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  ngOnInit(): void {
    this.animateStats();
  }

  private animateStats(): void {
    gsap.fromTo(
      '.stat-card',
      { opacity: 0.7, y: 20 },
      {
        duration: 0.4,
        opacity: 1,
        y: 0,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'transform',
      },
    );
  }
}
