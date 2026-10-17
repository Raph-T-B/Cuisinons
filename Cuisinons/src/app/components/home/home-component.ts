import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RecipeService } from '../../../services/recipe.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, TruncatePipe], // Ajouté ici
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getLatestRecipes().subscribe({
      next: (data) => {
        this.recipes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Impossible de charger les recettes.';
        this.isLoading = false;
      }
    });
  }

  getAverageRating(recipe: Recipe): number | null {
    return this.recipeService.calculateAverageRating(recipe.reviews);
  }
}
