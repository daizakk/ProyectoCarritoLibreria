import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SuserService } from '../services/suser';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(SuserService);
  const token = userService.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  return next(req);
};