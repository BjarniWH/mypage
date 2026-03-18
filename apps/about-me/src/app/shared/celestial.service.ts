import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CelestialService {
  /**
   * True if the mouse is hovering over important UI elements (like the sidebar)
   * that should suppress immersive background effects like the black hole.
   */
  isOverUI = signal(false);
}
