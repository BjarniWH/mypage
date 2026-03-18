import { Component, ElementRef, viewChild, afterNextRender, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

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
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  host: {
    '(document:mousemove)': 'onMouseMove($event)'
  }
})
export class LandingComponent implements OnDestroy {
  canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('particleCanvas');
  
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  
  private particles: Particle[] = [];
  private numParticles = 400;
  private effectRadius = 200; 
  private gravityStrength = 0.15;
  
  private mouseX = -1000;
  private mouseY = -1000;

  constructor() {
    afterNextRender(() => {
      this.initCanvas();
      this.animate();
      window.addEventListener('resize', this.onResize);
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.initCanvas();
  };

  initCanvas() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.createParticles();
  }

  createParticles() {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        // Some are "stars" (smaller, brighter, twinkling), some are "dust" (larger, dimmer, static)
        const isStar = Math.random() > 0.4;
        const size = isStar ? Math.random() * 1.5 + 0.5 : Math.random() * 1.2 + 0.2;
        
        this.particles.push({
            baseX: x,
            baseY: y,
            x: x,
            y: y,
            size: size,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2,
            isStar: isStar,
            color: isStar ? 'rgba(226, 232, 240, ' : 'rgba(148, 163, 184, '
        });
    }
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private animate = () => {
    if (!this.ctx) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;

    for (const p of this.particles) {
        // Calculate distance to mouse
        const dx = this.mouseX - p.x;
        const dy = this.mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Gravity pull logic
        if (distance < this.effectRadius) {
            const force = (this.effectRadius - distance) / this.effectRadius;
            const pullX = dx * force * this.gravityStrength;
            const pullY = dy * force * this.gravityStrength;
            p.x += pullX;
            p.y += pullY;
        }

        // Gentleness: return to base position slowly
        p.x += (p.baseX - p.x) * 0.05;
        p.y += (p.baseY - p.y) * 0.05;

        // Twinkle logic
        let opacity = p.isStar ? 0.4 : 0.2;
        if (p.isStar) {
            opacity += Math.sin(time * p.twinkleSpeed * 100 + p.twinklePhase) * 0.3;
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color}${Math.max(0.1, opacity)})`;
        this.ctx.fill();
    }
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
