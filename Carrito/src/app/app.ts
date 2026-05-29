import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Cheader } from './core/layout/header/cheader';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Cheader, CommonModule],
  template: `
    <app-header *ngIf="showHeader()"></app-header>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Carrito');
  showHeader = signal(true);

  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const rutasOcultas = ['/', '/register'];
      this.showHeader.set(!rutasOcultas.includes(event.urlAfterRedirects));
    });
  }
}