import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification-service';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthentificationService);
  const router = inject(Router);

  // Si l'utilisateur est déjà connecté, on l'envoie sur l'accueil
  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  // Sinon, il peut accéder à la page de login
  return true;
};
