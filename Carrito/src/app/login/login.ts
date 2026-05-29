import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuserService } from '../core/services/suser';
import { cartFachada } from '../cart/facade/fcart';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  private cartFacade = inject(cartFachada);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: SuserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.userService.logout();
    this.cartFacade.clearCart();
    this.cartFacade.closeCart();
    setTimeout(() => {
      this.loginForm.reset({ email: '', password: '' });
    }, 100);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  enviar() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: (user) => {
        this.loading = false;
        alert(`¡Bienvenido ${user.nombre || user.email}!`);
        if (user.role === 'Admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al iniciar sesión:', error);
        this.errorMessage = error.error?.message || 'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }
}