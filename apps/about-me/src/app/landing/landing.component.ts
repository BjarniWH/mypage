import { Component, ElementRef, viewChild, afterNextRender, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  
  // Distance around mouse where distortion happens
  private effectRadius = 250; 
  // Base spacing for the grid
  private spacing = 40;
  
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
  }

  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  private animate = () => {
    if (!this.ctx) return;
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const rows = Math.ceil(canvas.height / this.spacing);
    const cols = Math.ceil(canvas.width / this.spacing);

    for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            const x = i * this.spacing;
            const y = j * this.spacing;
            
            // Calculate distance to mouse
            const dx = x - this.mouseX;
            const dy = y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate scale based on distance
            // Base radius is 1.5. Shrinks to 0.2 if exact match. Starts shrinking inside effectRadius
            let currentRadius = 1.6;
            let currentOpacity = 0.5;

            if (dist < this.effectRadius) {
                // Ratio goes from 0 (at cursor) to 1 (at edge of radius)
                const ratio = dist / this.effectRadius;
                // Easing function for smoother indentation
                const ease = 1 - Math.pow(1 - ratio, 2); 
                
                // Radius shrinks
                currentRadius = 0.4 + (1.2 * ease);
                // Opacity increases slightly for emphasis near cursor, then fades out
                currentOpacity = 0.8 * ease;
            }

            this.ctx.beginPath();
            this.ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
            // Crisp steel / violet color fitting the dark aesthetic
            this.ctx.fillStyle = `rgba(148, 163, 184, ${currentOpacity})`;
            this.ctx.fill();
        }
    }
    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
