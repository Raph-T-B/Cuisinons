import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RecettesService } from '../../services/RecettesService';
import { IngredientsService } from '../../services/IngredientsService';
import { AuthentificationService } from '../../services/authentification-service';
import { Recette } from '../../models/recettes';
import { Ingredient } from '../../models/ingredients';
import { Note } from '../../models/note';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recette | null = null;
  ingredients: Ingredient[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Formulaire d'ajout d'avis
  newRate: number = 5;
  newReview: string = '';
  isSubmittingReview: boolean = false;
  reviewError: string = '';
  reviewSuccess: string = '';

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private recettesServ: RecettesService,
    private ingredientsServ: IngredientsService,
    public authServ: AuthentificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot?.paramMap?.get('id');
    if (!id) {
      this.errorMessage = 'Identifiant de recette manquant.';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    // Charger les ingrédients pour résoudre leurs noms
    this.ingredientsServ.list().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement ingrédients:', err)
    });

    // Charger la recette
    this.recettesServ.getById(id).subscribe({
      next: (data) => {
        this.recipe = data;
        this.isLoading = false;
        if (data.name) {
          this.titleService.setTitle(`${data.name} - Cuisinons`);
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API recette:', err);
        this.errorMessage = 'Impossible de charger la recette demandée.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getIngredientName(idIngredient?: string | number): string {
    if (!idIngredient) return 'Ingrédient inconnu';
    const found = this.ingredients.find(i => String(i.id) === String(idIngredient));
    return found ? found.name : `Ingrédient #${idIngredient}`;
  }

  get reviews(): Note[] {
    if (!this.recipe) return [];
    return this.recipe.rates || this.recipe.notes || [];
  }

  get averageRating(): number | null {
    if (!this.recipe) return null;
    return this.recettesServ.getRecipeAverage(this.recipe);
  }

  get currentUsername(): string {
    return this.authServ.getCurrentUser()?.username || 'Anonyme';
  }

  onAddReview(): void {
    if (!this.recipe?.id) return;
    if (!this.newReview.trim()) {
      this.reviewError = 'Veuillez saisir un commentaire pour votre avis.';
      this.cdr.markForCheck();
      return;
    }
    if (this.newRate < 1 || this.newRate > 5) {
      this.reviewError = 'La note doit être comprise entre 1 et 5.';
      this.cdr.markForCheck();
      return;
    }

    this.isSubmittingReview = true;
    this.reviewError = '';

    const reviewItem: Note = {
      login: this.currentUsername,
      rate: Number(this.newRate),
      rating: Number(this.newRate),
      review: this.newReview.trim(),
      comment: this.newReview.trim()
    };

    const currentRates = this.reviews;

    this.recettesServ.addReview(this.recipe.id, currentRates, reviewItem).subscribe({
      next: (updatedRecipe) => {
        this.recipe = updatedRecipe;
        // Si MockAPI retourne le format mis à jour, s'assurer que rates est bien renseigné localement
        if (!this.recipe.rates || this.recipe.rates.length === 0) {
          this.recipe.rates = [...currentRates, reviewItem];
        }
        this.isSubmittingReview = false;
        this.reviewSuccess = 'Votre avis a été publié avec succès !';
        this.newReview = '';
        this.newRate = 5;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur ajout avis:', err);
        this.reviewError = 'Une erreur est survenue lors de l\'enregistrement de votre avis.';
        this.isSubmittingReview = false;
        this.cdr.markForCheck();
      }
    });
  }
}
