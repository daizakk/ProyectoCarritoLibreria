import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Iproduct } from "../../features/products/models/iproduct";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SproductService {
  private readonly API = 'https://localhost:7064/api/Libros';
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Iproduct[]>(this.API).pipe(
      map(libros => libros.map(l => ({
        ...l,
        title: l.titulo,
        price: l.precio
      })))
    );
  }

  update(id: number, dto: any) {
    return this.http.put(`${this.API}/${id}`, dto);
  }

  create(dto: any) {
    return this.http.post(this.API, dto);
  }
  delete(id: number) {
  return this.http.delete(`${this.API}/${id}`);
}
}