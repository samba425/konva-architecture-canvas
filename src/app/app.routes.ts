import { Routes } from '@angular/router';
import { KonvaCanvasMainComponent } from './components/konva-canvas-main/konva-canvas-main.component';

export const routes: Routes = [
  { path: '', component: KonvaCanvasMainComponent },
  { path: '**', redirectTo: '' }
];
