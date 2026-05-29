import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SuserService } from '../services/suser';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(SuserService);
  const router = inject(Router);

  if (userService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login si no está autenticado
  router.navigate(['']);
  return false;
};
