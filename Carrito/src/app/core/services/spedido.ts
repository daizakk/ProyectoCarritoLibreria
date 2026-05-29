import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SpedidoService {
  private readonly API = 'https://localhost:7064/api/Pedidos';
  private http = inject(HttpClient);

  getByUsuario(usuarioId: number) {
    return this.http.get<any[]>(`${this.API}/usuario/${usuarioId}`);
  }

  getTodos() {
    return this.http.get<any[]>(`${this.API}/todos`);
  }
}