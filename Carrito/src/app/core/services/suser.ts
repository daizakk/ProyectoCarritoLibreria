import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { IUser } from "../models/iuser";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class SuserService {
  private readonly API = 'https://localhost:7064/api/Usuarios';
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user:', e);
      }
    }
  }

  login(email: string, password: string): Observable<IUser> {
    return this.http.post<IUser>(`${this.API}/login`, { email, password }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        // ✅ Guardar token por separado
        if (user.token) localStorage.setItem('token', user.token);
      }),
      catchError(this.handleError)
    );
  }

  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.API}/registro`, user).pipe(
      tap(newUser => {
        this.currentUserSubject.next(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        if (newUser.token) localStorage.setItem('token', newUser.token);
      }),
      catchError(this.handleError)
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); // ✅ Borrar token también
  }

  getCurrentUser(): IUser | null { return this.currentUserSubject.value; }
  isAuthenticated(): boolean { return this.currentUserSubject.value !== null; }

  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.API).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error en el servidor';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.message || 'Error al conectar con el servidor';
    }
    return throwError(() => ({ error: { message: errorMessage }, status: error.status }));
  }
}