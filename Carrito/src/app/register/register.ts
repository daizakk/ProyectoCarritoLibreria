import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuserService } from '../core/services/suser';
import { IUser } from '../core/models/iuser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: SuserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      telefono: [''],
      direccion: [''],
      ciudad: ['']
    }, { validators: this.passwordMatchValidator });
  }

  get nombre() { return this.registerForm.get('nombre'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get direccion() { return this.registerForm.get('direccion'); }
  get ciudad() { return this.registerForm.get('ciudad'); }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  registrar() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Por favor completa el formulario correctamente';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const userData: IUser = {
      nombre: this.registerForm.get('nombre')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      telefono: this.registerForm.get('telefono')?.value,
      direccion: this.registerForm.get('direccion')?.value,
      ciudad: this.registerForm.get('ciudad')?.value
    };

    this.userService.register(userData).subscribe({
      next: (user) => {
        this.loading = false;
        this.successMessage = `¡Registro exitoso! Bienvenido ${user.nombre || user.email}`;

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        const mensajeError = error?.error?.message || error?.message || 'Error desconocido al registrar';
        this.errorMessage = mensajeError;
      }
    });
  }
}