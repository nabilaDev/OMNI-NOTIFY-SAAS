import { inject } from '@angular/core/primitives/di';
import { CanActivateFn, Router } from '@angular/router';

// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  if (token) {
    return true; // Accès autorisé
  } else {
    router.navigate(['/login']); // Redirection vers login si pas de token
    return false;
  }
};