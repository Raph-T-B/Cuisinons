import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/auth.guest';
import { LoginComponent } from './components/login/login-component';
import { HomeComponent } from './components/home/home-component';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './components/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { NotFound } from './components/not-found/not-found';
import { AuthentificationService } from './services/authentification-service';

export const routes: Routes = [
  // Redirection de la racine vers l'accueil
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'accueil'
  },

  // Page de connexion
  {
    path: 'connexion',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Connexion - Cuisinons'
  },
  {
    path: 'login',
    redirectTo: 'connexion'
  },

  // Page d'accueil (5 dernières recettes)
  {
    path: 'accueil',
    component: HomeComponent,
    canActivate: [authGuard],
    title: 'Accueil - Cuisinons'
  },
  {
    path: 'acceuil',
    redirectTo: 'accueil'
  },

  // Page listant toutes les recettes avec pagination et recherche
  {
    path: 'recettes',
    component: RecipeListComponent,
    canActivate: [authGuard],
    title: 'Toutes les recettes - Cuisinons'
  },

  // Page de création d'une recette
  {
    path: 'recette/ajout',
    component: RecipeCreateComponent,
    canActivate: [authGuard],
    title: 'Créer une recette - Cuisinons'
  },
  {
    path: 'recettes/creer',
    redirectTo: 'recette/ajout'
  },

  // Page de détail d'une recette
  {
    path: 'recette/:id',
    component: RecipeDetailComponent,
    canActivate: [authGuard],
    title: 'Détail de la recette - Cuisinons'
  },
  {
    path: 'recettes/:id',
    component: RecipeDetailComponent,
    canActivate: [authGuard],
    title: 'Détail de la recette - Cuisinons'
  },

  // Page 404
  {
    path: '404',
    component: NotFound,
    title: 'Page non trouvée - Cuisinons'
  },

  // Route Wildcard
  {
    path: '**',
    redirectTo: () => {
      const authService = inject(AuthentificationService);
      return authService.isLoggedIn() ? '/404' : '/connexion';
    }
  }
];
