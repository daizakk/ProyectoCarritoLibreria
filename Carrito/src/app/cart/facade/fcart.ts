import { Injectable, signal, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Iproduct } from "../../features/products/models/iproduct";
import { Icart } from "../models/icart";
import { SuserService } from "../../core/services/suser";
import { ProductsFacade } from "../../features/products/facade/fproduct";

@Injectable({ providedIn: 'root' })
export class cartFachada {
  private http = inject(HttpClient);
  private userService = inject(SuserService);
  private productsFacade = inject(ProductsFacade);
  private readonly API = 'https://localhost:7064/api/Pedidos';

  items = signal<Icart[]>([]);
  showCart = signal(false);
  purchaseHistory = signal<any[]>([]);
  historialCargado = false;

  addProduct(product: Iproduct) {
    this.items.update(items => {
      const found = items.find(i => i.product.id === product.id);
      if (found) {
        return items.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeProduct(productId: number) {
    this.items.update(items => items.filter(i => i.product.id !== productId));
  }

  decreaseProduct(productId: number) {
    this.items.update(items =>
      items
        .map(i => i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  clearCart() { this.items.set([]); }
  totalItems() { return this.items().reduce((s, i) => s + i.quantity, 0); }
  totalPrice() { return this.items().reduce((s, i) => s + i.product.price * i.quantity, 0); }
  toggle() { this.showCart.update(v => !v); }
  openCart() { this.showCart.set(true); }
  closeCart() { this.showCart.set(false); }
  getCurrentUser() { return this.userService.getCurrentUser(); }

  checkout(facturacion: any) {
    const user = this.userService.getCurrentUser();
    if (!user?.id) {
      alert('Debes iniciar sesión para comprar');
      return false;
    }

    const dto = {
      usuarioId: user.id,
      facturacion,
      items: this.items().map(i => ({
        libroId: i.product.id,
        cantidad: i.quantity,
        precioUnitario: i.product.price
      }))
    };

    this.http.post(this.API, dto).subscribe({
      next: () => {
        alert(`¡Compra realizada! Total: €${this.totalPrice().toFixed(2)}`);
        this.clearCart();
        this.historialCargado = false;
        this.cargarHistorial();
        this.productsFacade.loadProducts();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al procesar la compra.';
        alert(msg);
      }
    });

    return true;
  }

  cargarHistorial() {
    const user = this.userService.getCurrentUser();
    if (!user?.id) return;

    this.http.get<any[]>(`${this.API}/usuario/${user.id}`).subscribe({
      next: (pedidos) => {
        const mapped = pedidos.map(p => ({
          id: p.id,
          date: new Date(p.fechaPedido).toLocaleString('es-ES'),
          total: p.total,
          items: p.detalles.map((d: any) => ({
            product: { id: d.libroId, title: d.titulo, price: d.precioUnitario },
            quantity: d.cantidad
          }))
        }));
        this.purchaseHistory.set(mapped);
        this.historialCargado = true;
      },
      error: () => console.error('Error cargando historial')
    });
  }
}