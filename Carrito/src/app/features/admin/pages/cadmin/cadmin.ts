import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsFacade } from '../../../products/facade/fproduct';
import { Iproduct } from '../../../products/models/iproduct';
import { SproductService } from '../../../../core/services/sproduct';
import { SuserService } from '../../../../core/services/suser';
import { SpedidoService } from '../../../../core/services/spedido';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadmin.html',
  styleUrl: './cadmin.css'
})
export class AdminPageComponent implements OnInit {
  private productsFacade = inject(ProductsFacade);
  private productService = inject(SproductService);
  private userService = inject(SuserService);
  private pedidoService = inject(SpedidoService);

  products = this.productsFacade.products;
  loading = this.productsFacade.loading;

  // ── Tabs ──────────────────────────────────────────────────────────────────
  activeTab = signal<'libros' | 'usuarios'>('libros');

  // ── Filtros libros ────────────────────────────────────────────────────────
  searchText = signal('');
  selectedFormato = signal('Todos');
  selectedStock = signal('todos');
  sortOption = signal('default');

  // ── Modales libros ────────────────────────────────────────────────────────
  showEditModal = signal(false);
  editingProduct = signal<Iproduct | null>(null);
  editForm = signal({
    isbn: '', titulo: '', autor: '', editorial: '',
    formato: '', edicion: '', precio: 0, stock: 0,
    imagenUrl: '', sinopsis: ''
  });
  showAddModal = signal(false);
  newBook = signal({
    isbn: '', titulo: '', autor: '', editorial: '',
    formato: '', edicion: '', precio: 0, stock: 0,
    imagenUrl: '', sinopsis: ''
  });

  // ── Usuarios e historial ──────────────────────────────────────────────────
  usuarios = signal<any[]>([]);
  selectedUser = signal<any | null>(null);
  userOrders = signal<any[]>([]);
  loadingOrders = signal(false);

  formatos = computed(() => {
    const unique = new Set(this.products().map(p => p.formato).filter(Boolean));
    return ['Todos', ...Array.from(unique).sort()];
  });

  filteredProducts = computed(() => {
    let items = this.products();
    const search = this.searchText().toLowerCase().trim();
    if (search) items = items.filter(p =>
      p.titulo.toLowerCase().includes(search) ||
      p.autor.toLowerCase().includes(search)
    );
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
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.userService.getAll().subscribe({
      next: (users) => this.usuarios.set(users.filter(u => u.role !== 'Admin')),
      error: () => alert('Error cargando usuarios')
    });
  }

  verHistorial(user: any) {
    this.selectedUser.set(user);
    this.loadingOrders.set(true);
    this.pedidoService.getByUsuario(user.id).subscribe({
      next: (orders) => {
        this.userOrders.set(orders);
        this.loadingOrders.set(false);
      },
      error: () => {
        alert('Error cargando historial');
        this.loadingOrders.set(false);
      }
    });
  }

  volverAUsuarios() {
    this.selectedUser.set(null);
    this.userOrders.set([]);
  }

  // ── Editar ────────────────────────────────────────────────────────────────
  openEdit(product: Iproduct) {
    this.editingProduct.set(product);
    this.editForm.set({
      isbn: product.isbn, titulo: product.titulo, autor: product.autor,
      editorial: product.editorial, formato: product.formato, edicion: product.edicion,
      precio: product.precio, stock: product.stock,
      imagenUrl: product.imagenUrl ?? '', sinopsis: product.sinopsis ?? ''
    });
    this.showEditModal.set(true);
  }

  updateEditForm(field: string, value: any) {
    this.editForm.update(f => ({ ...f, [field]: value }));
  }

  saveEdit() {
    const product = this.editingProduct();
    if (!product) return;
    this.productService.update(product.id, this.editForm()).subscribe({
      next: () => { this.productsFacade.loadProducts(); this.showEditModal.set(false); },
      error: () => alert('Error al guardar cambios')
    });
  }

  deleteProduct(product: Iproduct) {
    const confirmed = confirm(`¿Estás seguro de que quieres eliminar "${product.titulo}"? Esta acción no se puede deshacer.`);
    if (!confirmed) return;
    this.productService.delete(product.id).subscribe({
      next: () => this.productsFacade.loadProducts(),
      error: () => alert('Error al eliminar el libro')
    });
  }

  // ── Añadir ────────────────────────────────────────────────────────────────
  openAdd() {
    this.newBook.set({
      isbn: '', titulo: '', autor: '', editorial: '',
      formato: '', edicion: '', precio: 0, stock: 0, imagenUrl: '', sinopsis: ''
    });
    this.showAddModal.set(true);
  }

  saveAdd() {
    const book = this.newBook();
    if (!book.isbn || !book.titulo || !book.autor) {
      alert('ISBN, título y autor son obligatorios');
      return;
    }
    this.productService.create(book).subscribe({
      next: () => { this.productsFacade.loadProducts(); this.showAddModal.set(false); },
      error: (err) => {
        const mensaje = err.error || err.error?.message || 'Error al añadir el libro';
        alert(mensaje);
      }
    });
  }

  getImageUrl(product: Iproduct): string {
    if (product.imagenUrl?.trim()) return product.imagenUrl;
    if (product.isbn?.trim()) return `https://covers.openlibrary.org/b/isbn/${product.isbn}-L.jpg`;
    return 'assets/no-cover.png';
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/no-cover.png';
  }

  updateNewBook(field: string, value: any) {
    this.newBook.update(b => ({ ...b, [field]: value }));
  }
}
