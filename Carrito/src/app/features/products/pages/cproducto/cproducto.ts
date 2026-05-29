import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { ProductsFacade } from "../../facade/fproduct";
import { Iproduct } from "../../models/iproduct";
import { cartFachada } from "../../../../cart/facade/fcart";
import { CartComponent } from "../../../../cart/facade/ccart/ccart";

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [CommonModule, CartComponent],
  templateUrl: './cproducto.html',
  styleUrl: './cproducto.css'
})
export class ProductsPageComponent implements OnInit {
  private productsFacade = inject(ProductsFacade);
  private cartFacade = inject(cartFachada);

  products = this.productsFacade.products;
  loading = this.productsFacade.loading;

  searchText = signal('');
  selectedFormato = signal('Todos');
  selectedStock = signal('todos');
  sortOption = signal('default');

  selectedProduct = signal<Iproduct | null>(null);

  formatos = computed(() => {
    const unique = new Set(this.products().map(p => p.formato).filter(Boolean));
    return ['Todos', ...Array.from(unique).sort()];
  });

  filteredProducts = computed(() => {
    let items = this.products();
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      items = items.filter(p =>
        p.titulo.toLowerCase().includes(search) ||
        p.autor.toLowerCase().includes(search) ||
        p.sinopsis.toLowerCase().includes(search)
      );
    }
    const formato = this.selectedFormato();
    if (formato !== 'Todos') items = items.filter(p => p.formato === formato);
    const stock = this.selectedStock();
    if (stock === 'con-stock') items = items.filter(p => p.stock > 0);
    if (stock === 'sin-stock') items = items.filter(p => p.stock === 0);
    if (this.sortOption() === 'price-asc') items = [...items].sort((a, b) => a.precio - b.precio);
    if (this.sortOption() === 'price-desc') items = [...items].sort((a, b) => b.precio - a.precio);
    return items;
  });

  ngOnInit() {
    this.productsFacade.loadProducts();
  }

  openDetail(product: Iproduct) {
    this.selectedProduct.set(product);
  }

  closeDetail() {
    this.selectedProduct.set(null);
  }

  addToCart(product: Iproduct) {
    this.cartFacade.addProduct(product);
    this.cartFacade.openCart();
    this.closeDetail();
  }

  getImageUrl(product: Iproduct): string {
    if (product.imagenUrl?.trim()) return product.imagenUrl;
    if (product.isbn?.trim()) return `https://covers.openlibrary.org/b/isbn/${product.isbn}-L.jpg`;
    return 'assets/no-cover.png';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/no-cover.png';
  }
}