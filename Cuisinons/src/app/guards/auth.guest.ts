import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification-service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/accueil']);
  }

  return true;
};
