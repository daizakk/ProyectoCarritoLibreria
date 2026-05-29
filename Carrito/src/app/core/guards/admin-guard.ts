import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SuserService } from '../services/suser';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(SuserService);
  const router = inject(Router);

  const user = userService.getCurrentUser();

  if (user && user.role === 'Admin') {
    return true;
  }

  router.navigate(['']);
  return false;
};