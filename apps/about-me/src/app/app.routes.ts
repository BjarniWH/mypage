import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LandingComponent } from './landing/landing.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'about', component: AboutComponent },
    ],
  },
];
