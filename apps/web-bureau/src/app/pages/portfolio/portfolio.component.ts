import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portfolio-container">
      <div class="portfolio-hero">
        <h1>Our Portfolio</h1>
        <p class="subtitle">Showcasing our latest and greatest projects</p>
      </div>

      <div class="portfolio-grid">
        <div class="portfolio-item" *ngFor="let project of projects; let i = index">
          <div class="portfolio-card">
            <div class="portfolio-image" [style.background]="project.color"></div>
            <div class="portfolio-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span class="tag" *ngFor="let tag of project.tags">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent {
  projects = [
    {
      title: 'Modern E-Commerce Platform',
      description: 'A sleek and responsive e-commerce solution with stunning animations',
      tags: ['Design', 'Development', 'Animation'],
      color: 'linear-gradient(135deg, #f5a962 0%, #f78552 100%)'
    },
    {
      title: 'Brand Identity System',
      description: 'Complete branding package including logo, guidelines, and digital assets',
      tags: ['Branding', 'Design', 'Guidelines'],
      color: 'linear-gradient(135deg, #ff9a56 0%, #ff8a4b 100%)'
    },
    {
      title: 'Mobile App Experience',
      description: 'User-centric mobile application with smooth interactions',
      tags: ['UI/UX', 'Development', 'Mobile'],
      color: 'linear-gradient(135deg, #f59e6e 0%, #f58d5a 100%)'
    },
    {
      title: 'Corporate Website',
      description: 'Professional website showcasing company services and expertise',
      tags: ['Web', 'Design', 'SEO'],
      color: 'linear-gradient(135deg, #f5a962 0%, #ff9456 100%)'
    },
    {
      title: 'Digital Marketing Campaign',
      description: 'Integrated campaign with web, social, and print elements',
      tags: ['Marketing', 'Design', 'Strategy'],
      color: 'linear-gradient(135deg, #ff9d6a 0%, #ff8c5a 100%)'
    },
    {
      title: 'Interactive Dashboard',
      description: 'Real-time data visualization with beautiful and functional design',
      tags: ['Development', 'Data', 'UI'],
      color: 'linear-gradient(135deg, #f5a962 0%, #ff9b5c 100%)'
    }
  ];

  ngOnInit() {
    this.animatePortfolio();
  }

  private animatePortfolio() {
    gsap.from('.portfolio-item', {
      duration: 0.8,
      opacity: 0,
      y: 40,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }
}
