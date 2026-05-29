import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { cartFachada } from '../../../cart/facade/fcart';
import { SuserService } from '../../services/suser';
import { Observable } from 'rxjs';
import { IUser } from '../../models/iuser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <h1>Librería Pedro</h1>
      <div class="header-right">
        <!-- Usuario actual -->
        <ng-container *ngIf="currentUser$ | async as user">
          <div class="user-info" *ngIf="user">
            <span>Bienvenido, {{ user.nombre || user.email }}</span>
            <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
          </div>
        </ng-container>
        <!-- Carrito -->
        <button class="cart-btn" (click)="toggleCart()">
          Carrito ({{ totalItems() }})
        </button>
      </div>
    </header>
  `,
  styleUrls: ['./cheader.css']
})
export class Cheader {
  private cartFacade = inject(cartFachada);
  private userService = inject(SuserService);
  private router = inject(Router);

  currentUser$: Observable<IUser | null> = this.userService.currentUser$;

  toggleCart() {
    this.cartFacade.toggle();
  }

  totalItems() {
    return this.cartFacade.totalItems();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }
}