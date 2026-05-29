import { inject, Injectable, signal } from '@angular/core';
import { Iproduct } from '../models/iproduct';
import { SproductService } from '../../../core/services/sproduct';
@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  private api = inject(SproductService);
  products = signal<Iproduct[]>([]);
  loading = signal(false);
  loadProducts() {
    this.loading.set(true);
    this.api.getAll().subscribe((products) => {
      this.products.set(products);
      this.loading.set(false);
    });
  }
}
