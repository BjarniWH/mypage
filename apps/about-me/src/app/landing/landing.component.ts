import { Component, ElementRef, viewChild, afterNextRender, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelestialService } from '../shared/celestial.service';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isStar: boolean;
  color: string;
  opacity?: number;
  twinkle: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  active: boolean;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingComponent implements OnDestroy {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('particleCanvas');
  private celestialService = inject(CelestialService);
  
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId?: number;
  
  private particles: Particle[] = [];
  private shootingStars: ShootingStar[] = [];
  
  private mouseX = -1000;
  private mouseY = -1000;

  // Configuration
  private readonly particleCount = 400;
  private readonly effectRadius = 200; 
  private readonly gravityStrength = 0.04; // Reduced for subtle effect
  private readonly returnStrength = 0.025; // Balanced for smoothness and responsiveness

  constructor() {
    afterNextRender(() => {
      this.initCanvas();
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('mouseout', this.onMouseLeave);
    window.removeEventListener('blur', this.onMouseLeave);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseLeave = () => {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  private resizeCanvas = () => {
    const canvasEl = this.canvas().nativeElement;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    this.createParticles();
  };

  private initCanvas() {
    const canvasEl = this.canvas().nativeElement;
    const ctx = canvasEl.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.resizeCanvas();
    
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('mouseout', this.onMouseLeave);
    window.addEventListener('blur', this.onMouseLeave);

    this.animate();
  }

  private createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const isStar = Math.random() > 0.4;
        const size = isStar ? Math.random() * 1.5 + 0.5 : Math.random() * 1.2 + 0.2;
        
        this.particles.push({
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            size: size,
            twinkle: isStar,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2,
            isStar: isStar,
            color: isStar ? 'rgba(226, 232, 240, ' : 'rgba(148, 163, 184, ',
            opacity: Math.random() * 0.5 + 0.5,
        });
    }
  }

  private triggerShootingStar() {
    if (Math.random() > 0.995) {
      // Pick a random edge to start
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x = 0;
      let y = 0;
      const tx = Math.random() * window.innerWidth;
      const ty = Math.random() * window.innerHeight;

      if (edge === 0) { x = Math.random() * window.innerWidth; y = -50; }
      else if (edge === 1) { x = window.innerWidth + 50; y = Math.random() * window.innerHeight; }
      else if (edge === 2) { x = Math.random() * window.innerWidth; y = window.innerHeight + 50; }
      else { x = -50; y = Math.random() * window.innerHeight; }

      const dx = tx - x;
      const dy = ty - y;
      const angle = Math.atan2(dy, dx);
      const speed = Math.random() * 8 + 8;

      this.shootingStars.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 40,
        opacity: 1,
        active: true,
      });
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (this.mouseX !== -1000 && !this.celestialService.isOverUI()) {
      const gradient = this.ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, 50
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.4, 'rgba(5, 2, 10, 0.8)');
      gradient.addColorStop(0.7, 'rgba(60, 30, 150, 0.1)');
      gradient.addColorStop(1, 'rgba(60, 30, 150, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 50, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = 'rgba(100, 60, 200, 0.05)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 20, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    this.triggerShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.opacity -= 0.02;

      if (s.opacity <= 0 || s.x > window.innerWidth || s.y > window.innerHeight) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 2, s.y - s.vy * 2);
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
      this.ctx.stroke();
    }
    
    this.particles.forEach((p) => {
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const isOverUI = this.celestialService.isOverUI();
        if (!isOverUI && distance < this.effectRadius) {
            const force = (this.effectRadius - distance) / this.effectRadius;
            const pull = force * this.gravityStrength;
            
            const swirlStrength = force * 0.03;
            const swirlX = -dy * swirlStrength;
            const swirlY = dx * swirlStrength;

            p.x += dx * pull + swirlX;
            p.y += dy * pull + swirlY;
            
            // Removed absorption: just let them swirl and pass through
        } else {
            p.x += (p.baseX - p.x) * this.returnStrength;
            p.y += (p.baseY - p.y) * this.returnStrength;
        }

        // Handle opacity gently
        p.opacity = Math.min(1, (p.opacity ?? 1) + 0.01);

        let currentOpacity = 0.8;
        if (p.twinkle) {
            p.twinklePhase += p.twinkleSpeed;
            currentOpacity = (Math.sin(p.twinklePhase) + 1) / 2 * 0.8 + 0.2;
        }
        
        currentOpacity *= (p.opacity ?? 1);

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${Math.max(0.1, currentOpacity)})`;
        this.ctx.fill();
    });
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
