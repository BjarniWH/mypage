import { Directive, ElementRef, inject, OnDestroy, Renderer2, afterNextRender, NgZone } from '@angular/core';
import { CelestialService } from '../celestial.service';

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

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
}

@Directive({
  selector: '[appCelestialBackground]',
  standalone: true,
})
export class CelestialBackgroundDirective implements OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private celestialService = inject(CelestialService);
  private ngZone = inject(NgZone);

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId?: number;
  
  private particles: Particle[] = [];
  private shootingStars: ShootingStar[] = [];
  private nebulas: Nebula[] = [];
  
  private mouseX = -1000;
  private mouseY = -1000;
  private isMouseIn = false;

  // Configuration
  private readonly particleCount = 400;
  private readonly effectRadius = 200; 
  private readonly gravityStrength = 0.04;
  private readonly returnStrength = 0.025;

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
    document.removeEventListener('mouseenter', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mouseout', this.onMouseLeave);
    window.removeEventListener('blur', this.onMouseLeave);
    window.removeEventListener('focus', this.onMouseLeave);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.isMouseIn = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private onMouseLeave = () => {
    this.isMouseIn = false;
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  private onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      this.onMouseLeave();
    }
  }

  private resizeCanvas = () => {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.createParticles();
    this.initNebulas();
  };

  private initCanvas() {
    this.canvas = this.renderer.createElement('canvas');
    this.renderer.setStyle(this.canvas, 'position', 'fixed');
    this.renderer.setStyle(this.canvas, 'top', '0');
    this.renderer.setStyle(this.canvas, 'left', '0');
    this.renderer.setStyle(this.canvas, 'width', '100%');
    this.renderer.setStyle(this.canvas, 'height', '100%');
    this.renderer.setStyle(this.canvas, 'z-index', '-1');
    this.renderer.setStyle(this.canvas, 'pointer-events', 'none');
    
    this.renderer.appendChild(this.el.nativeElement, this.canvas);
    
    const ctx = this.canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    this.ctx = ctx;
    this.resizeCanvas();
    
    window.addEventListener('resize', this.resizeCanvas);
    window.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseenter', this.onMouseMove);
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseout', this.onMouseLeave);
    window.addEventListener('blur', this.onMouseLeave);
    window.addEventListener('focus', this.onMouseLeave);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private initNebulas() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Specialized mobile configuration: center them more and use fewer, larger blobs
      this.nebulas = [
        { x: 0.3, y: 0.4, radius: 0.8, color: 'rgba(147, 51, 234, 0.15)', angle: 0, speed: 0.0005 },
        { x: 0.7, y: 0.6, radius: 0.9, color: 'rgba(59, 130, 246, 0.12)', angle: Math.PI / 2, speed: 0.0004 },
        { x: 0.5, y: 0.3, radius: 0.7, color: 'rgba(236, 72, 153, 0.08)', angle: Math.PI, speed: 0.0006 }
      ];
    } else {
      this.nebulas = [
        { x: 0.1, y: 0.2, radius: 0.6, color: 'rgba(147, 51, 234, 0.15)', angle: 0, speed: 0.0005 },
        { x: 0.8, y: 0.8, radius: 0.7, color: 'rgba(59, 130, 246, 0.12)', angle: Math.PI / 2, speed: 0.0004 },
        { x: 0.4, y: 0.5, radius: 0.5, color: 'rgba(236, 72, 153, 0.08)', angle: Math.PI, speed: 0.0006 },
        { x: 0.2, y: 0.7, radius: 0.4, color: 'rgba(6, 182, 212, 0.1)', angle: Math.PI * 1.5, speed: 0.0003 }
      ];
    }
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
      const edge = Math.floor(Math.random() * 4); 
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
    // Fill background
    this.ctx.fillStyle = '#09090b';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Nebulas
    this.nebulas.forEach(n => {
      n.angle += n.speed;
      const offsetX = Math.cos(n.angle) * 50;
      const offsetY = Math.sin(n.angle * 0.8) * 30;
      const x = n.x * this.canvas.width + offsetX;
      const y = n.y * this.canvas.height + offsetY;
      const r = n.radius * Math.max(this.canvas.width, this.canvas.height);

      const grad = this.ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      
      this.ctx.fillStyle = grad;
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalCompositeOperation = 'source-over';
    });

    // Draw Black Hole Glow (Behind stars)
    if (this.isMouseIn && this.mouseX !== -1000 && !this.celestialService.isOverUI()) {
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

      if (s.opacity <= 0 || s.x > this.canvas.width || s.y > this.canvas.height) {
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
        if (this.isMouseIn && !isOverUI && distance < this.effectRadius) {
            const force = (this.effectRadius - distance) / this.effectRadius;
            const pull = force * this.gravityStrength;
            
            const swirlStrength = force * 0.03;
            const swirlX = -dy * swirlStrength;
            const swirlY = dx * swirlStrength;

            p.x += dx * pull + swirlX;
            p.y += dy * pull + swirlY;
        } else {
            p.x += (p.baseX - p.x) * this.returnStrength;
            p.y += (p.baseY - p.y) * this.returnStrength;
        }

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
