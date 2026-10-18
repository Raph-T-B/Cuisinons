import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RecettesService } from '../../services/RecettesService';
import { IngredientsService } from '../../services/IngredientsService';
import { Ingredient } from '../../models/ingredients';
import { IngredientRecette } from '../../models/ingredient-recette';

interface CompositionFormRow {
  idIngredient: string | number | '';
  quantity: number | null;
}

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recipe-create.component.html',
  styleUrl: './recipe-create.component.css'
})
export class RecipeCreateComponent implements OnInit {
  name: string = '';
  description: string = '';
  compositionRows: CompositionFormRow[] = [
    { idIngredient: '', quantity: 1 },
    { idIngredient: '', quantity: 1 }
  ];

  availableIngredients: Ingredient[] = [];
  isLoadingIngredients: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Nouvel ingrédient rapide
  showNewIngredientModal: boolean = false;
  newIngredientName: string = '';
  isAddingNewIngredient: boolean = false;

  constructor(
    private recettesServ: RecettesService,
    private ingredientsServ: IngredientsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientsServ.list().subscribe({
      next: (data) => {
        this.availableIngredients = data;
        this.isLoadingIngredients = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement ingrédients:', err);
        this.errorMessage = 'Impossible de charger la liste des ingrédients.';
        this.isLoadingIngredients = false;
        this.cdr.markForCheck();
      }
    });
  }

  addIngredientRow(): void {
    this.compositionRows.push({ idIngredient: '', quantity: 1 });
  }

  removeIngredientRow(index: number): void {
    if (this.compositionRows.length > 1) {
      this.compositionRows.splice(index, 1);
    }
  }

  get validIngredients(): IngredientRecette[] {
    return this.compositionRows
      .filter(row => row.idIngredient !== '' && row.quantity !== null && row.quantity > 0)
      .map(row => ({
        idIngredient: row.idIngredient,
        quantity: Number(row.quantity)
      }));
  }

  get isNameValid(): boolean {
    return this.name.trim().length > 0;
  }

  get isDescriptionValid(): boolean {
    return this.description.trim().length >= 30;
  }

  get hasMinimumIngredients(): boolean {
    return this.validIngredients.length >= 2;
  }

  get isFormValid(): boolean {
    return this.isNameValid && this.isDescriptionValid && this.hasMinimumIngredients;
  }

  onSubmit(): void {
    if (!this.isFormValid || this.isSubmitting) {
      if (!this.isNameValid) {
        this.errorMessage = 'Le nom de la recette est obligatoire.';
      } else if (!this.isDescriptionValid) {
        this.errorMessage = 'La description doit comporter au moins 30 caractères.';
      } else if (!this.hasMinimumIngredients) {
        this.errorMessage = 'Vous devez renseigner au moins 2 ingrédients avec une quantité valide (> 0).';
      }
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const newRecipe = {
      name: this.name.trim(),
      description: this.description.trim(),
      composition: this.validIngredients,
      rates: []
    };

    this.recettesServ.AjtRecette(newRecipe).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.successMessage = 'Recette créée avec succès ! Redirection en cours...';
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/recette', created.id]);
        }, 1200);
      },
      error: (err) => {
        console.error('Erreur création recette:', err);
        this.errorMessage = 'Une erreur est survenue lors de la création de la recette.';
        this.isSubmitting = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Création rapide d'un ingrédient
  onQuickAddIngredient(): void {
    if (!this.newIngredientName.trim()) return;

    this.isAddingNewIngredient = true;
    this.ingredientsServ.addIngredients({ name: this.newIngredientName.trim() }).subscribe({
      next: (created) => {
        this.availableIngredients.push(created);
        this.newIngredientName = '';
        this.showNewIngredientModal = false;
        this.isAddingNewIngredient = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur ajout ingrédient:', err);
        this.isAddingNewIngredient = false;
        this.cdr.markForCheck();
      }
    });
  }
}
