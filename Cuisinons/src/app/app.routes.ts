import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/auth.guest';
import { LoginComponent } from './components/login/login-component';
import { HomeComponent } from './components/home/home-component';
import { NotFound } from './components/not-found/not-found';
// import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
// import { RecipeCreateComponent } from './components/recipe-create/recipe-create.component';
// import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

export const routes: Routes = [
  // Route par défaut quand non connecté
  {
    path: 'connexion',
    component: LoginComponent,
    canActivate:[guestGuard],
    title: 'Connexion'
  },
  // Routes protégées par la connection
  {
    path: 'acceuil',
    component: HomeComponent,
    canActivate: [authGuard],
    title: 'Accueil'
  },
  // {
  //   path: 'recettes',
  //   component: ListeRecetteComponent,
  //   canActivate: [authGuard],
  //   title: 'Toutes les Recettes'
  // },
  // {
  //   path: 'recette/ajout',
  //   component: CreerRecetteComponent,
  //   canActivate: [authGuard],
  //   title: 'Créer une Recette'
  // },
  // {
  //   path: 'recette/:id',
  //   component: DetailRecetteComponent,
  //   canActivate: [authGuard],
  //   title: 'Détail de la Recette'
  // },
  // Redirection par défaut si URL inconnue
  {
    path: '**',
    component : NotFound
  }
];
