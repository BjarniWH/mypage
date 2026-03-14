import { Component, signal, viewChild, ElementRef } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class LayoutComponent {
  isExpanded = signal(false);
  sidebar = viewChild<ElementRef>('sidebar');

  toggleSidebar() {
    this.isExpanded.update((expanded) => !expanded);
  }

  onDocumentClick(event: MouseEvent) {
    const sidebarEl = this.sidebar()?.nativeElement;
    if (!sidebarEl) return;

    const clickedInside = sidebarEl.contains(event.target as Node);
    
    if (this.isExpanded() && !clickedInside) {
      // Close if click is outside while expanded
      this.isExpanded.set(false);
    } else if (!this.isExpanded() && clickedInside) {
      // Open if click is inside while collapsed, UNLESS it's on a button or link
      const target = event.target as HTMLElement;
      const clickedInteractiveElement = target.closest('a') || target.closest('button');
      
      if (!clickedInteractiveElement) {
         this.isExpanded.set(true);
      }
    }
  }
}
