import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RecettesService } from '../../services/RecettesService';
import { Recette } from '../../models/recettes';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, TruncatePipe], // Ajouté ici
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent {
  recipes: Recette[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private recipeService: RecettesService) {}

  // ngOnInit(): void {
  //   this.recipeService.liste().subscribe({
  //     next: (data) => {
  //       this.recipes = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Erreur API:', err);
  //       this.errorMessage = 'Impossible de charger les recettes.';
  //       this.isLoading = false;
  //     }
  //   });
  // }

  // getAverageRating(recipe: Recette): number | null {
  //   return this.recipeService.MoyenneNotes(recipe.notes);
  // }
}
