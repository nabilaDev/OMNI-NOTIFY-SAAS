// auth-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // On vérifie directement la source de vérité
  const token = localStorage.getItem('access_token');

  if (token && token !== 'undefined') {
    return true;
  }
  
  return router.parseUrl('/login');
};