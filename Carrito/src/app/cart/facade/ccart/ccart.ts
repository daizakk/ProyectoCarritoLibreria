import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cartFachada } from '../fcart';
import { Iproduct } from '../../../features/products/models/iproduct';
import { PurchaseHistoryComponent } from '../purchase-history/purchase-history';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, PurchaseHistoryComponent, ReactiveFormsModule],
  templateUrl: './ccart.html',
  styleUrl: './ccart.css',
})
export class CartComponent {
  private cartFacade = inject(cartFachada);
  private fb = inject(FormBuilder);

  items = this.cartFacade.items;
  showCart = this.cartFacade.showCart;
  totalItems = this.cartFacade.totalItems;
  totalPrice = this.cartFacade.totalPrice;
  orders = this.cartFacade.purchaseHistory;
  showHistory = signal(false);
  showCheckoutModal = signal(false);

  checkoutForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    ciudad: ['', Validators.required],
    codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
  });

  add(product: Iproduct) { this.cartFacade.addProduct(product); }
  decrease(id: number) { this.cartFacade.decreaseProduct(id); }
  remove(id: number) { this.cartFacade.removeProduct(id); }
  totalprice() { return this.cartFacade.totalPrice(); }
  clear() { this.cartFacade.clearCart(); }
  removeProduct(productId: number) { this.cartFacade.removeProduct(productId); }
  clearCart() { this.cartFacade.clearCart(); }

  openCheckout() {
    if (this.items().length === 0) return;
    const user = this.cartFacade.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
        direccion: user.direccion || '',
        ciudad: user.ciudad || ''
      });
    }
    this.showCheckoutModal.set(true);
  }

  confirmCheckout() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    this.showCheckoutModal.set(false);
    this.cartFacade.checkout(this.checkoutForm.value);
  }

  toggleHistory() {
    const abriendo = !this.showHistory();
    this.showHistory.set(abriendo);
    if (abriendo) this.cartFacade.cargarHistorial();
  }

  closeCart() {
    this.cartFacade.closeCart();
    this.showHistory.set(false);
    this.showCheckoutModal.set(false);
  }

  trackByProductId(index: number, item: { product: { id: number } }): number {
    return item.product.id;
  }

  trackByOrderId(index: number, order: { id: number }): number {
    return order.id;
  }
}