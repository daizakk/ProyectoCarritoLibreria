export interface Iproduct {
  id: number;
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  formato: string;
  edicion: string;
  precio: number;
  imagenUrl: string;
  stock: number;
  sinopsis: string;
  disponible: boolean;

  // Alias usados por el carrito
  title: string;
  price: number;
}