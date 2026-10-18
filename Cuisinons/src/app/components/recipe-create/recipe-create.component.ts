import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { RecettesService } from '../../services/RecettesService';
import { IngredientsService } from '../../services/IngredientsService';
import { Ingredient } from '../../models/ingredients';
import { IngredientRecette } from '../../models/ingredient-recette';

interface CompositionFormRow {
  idIngredient: string | number | '';
  quantity: number | null;
  searchTerm?: string;
  isOpen?: boolean;
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
  { idIngredient: '', quantity: 1, searchTerm: '', isOpen: false },
  { idIngredient: '', quantity: 1, searchTerm: '', isOpen: false }
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
  newIngredientError: string = '';

  constructor(
    private recettesServ: RecettesService,
    private ingredientsServ: IngredientsService,
    private router: Router,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Créer une recette - Cuisinons');
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientsServ.list().subscribe({
      next: (data) => {
        this.availableIngredients = data.sort((a, b) =>
    a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
  );;
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

  // Renvoie uniquement les ingrédients disponibles pour la ligne actuelle
  getAvailableIngredientsForRow(currentIndex: number): Ingredient[] {
    const selectedIds = this.compositionRows
      .filter((_, idx) => idx !== currentIndex)
      .map(row => String(row.idIngredient))
      .filter(id => id !== '');

    return this.availableIngredients.filter(
      ing => !selectedIds.includes(String(ing.id))
    );
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
      } else if (!this.description.trim()) {
        this.errorMessage = 'La description est obligatoire.';
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

  // Création rapide d'un ingrédient inédit
  onQuickAddIngredient(): void {
    const nameTrimmed = this.newIngredientName.trim();
    if (!nameTrimmed) return;

    // Vérifier si l'ingrédient existe déjà dans la liste issue de l'API (comparaison du nom insensible à la casse)
    const alreadyExists = this.availableIngredients.some(
      (ing) => ing.name?.trim().toLowerCase() === nameTrimmed.toLowerCase()
    );

    if (alreadyExists) {
      this.newIngredientError = `L'ingrédient "${nameTrimmed}" existe déjà.`;
      this.cdr.markForCheck();
      return;
    }

    this.newIngredientError = '';
    this.isAddingNewIngredient = true;
    this.ingredientsServ.addIngredients({ name: nameTrimmed }).subscribe({
      next: (created) => {
        // 1. Ajouter au catalogue local et trier
        this.availableIngredients.push(created);
        this.availableIngredients.sort((a, b) =>
          a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' })
        );

        // 2. L'affecter directement à la recette (sur une ligne vide ou une nouvelle ligne)
        const emptyRow = this.compositionRows.find(r => r.idIngredient === '');
        if (emptyRow) {
          emptyRow.idIngredient = created.id;
          emptyRow.searchTerm = created.name;
          emptyRow.isOpen = false;
        } else {
          this.compositionRows.push({ idIngredient: created.id, quantity: 1, searchTerm: created.name, isOpen: false });
        }

        // 3. Réinitialiser et fermer le sous-formulaire
        this.newIngredientName = '';
        this.newIngredientError = '';
        this.showNewIngredientModal = false;
        this.isAddingNewIngredient = false;
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Erreur ajout ingrédient:', err);
        this.newIngredientError = err?.error?.message || "Une erreur est survenue lors de l'ajout de l'ingrédient.";
        this.isAddingNewIngredient = false;
        this.cdr.markForCheck();
      }
    });
  }



// Ajout d'une ligne
addIngredientRow(): void {
  this.compositionRows.push({ idIngredient: '', quantity: 1, searchTerm: '', isOpen: false });
}

// Récupère les ingrédients filtrés pour une ligne spécifique :
// 1. Exclut ceux sélectionnés sur les AUTRES lignes
// 2. Filtre selon le texte tapé dans l'input
getFilteredIngredientsForRow(currentIndex: number): Ingredient[] {
  const row = this.compositionRows[currentIndex];
  if (!row) return [];

  // IDs pris sur les autres lignes
  const otherSelectedIds = this.compositionRows
    .filter((_, idx) => idx !== currentIndex)
    .map(r => String(r.idIngredient))
    .filter(id => id !== '');

  // Ingrédients encore disponibles
  let list = this.availableIngredients.filter(
    ing => !otherSelectedIds.includes(String(ing.id))
  );

  // Filtre textuel si l'utilisateur tape quelque chose (sauf si c'est déjà l'ingrédient sélectionné)
  const currentSelected = this.availableIngredients.find(i => String(i.id) === String(row.idIngredient));
  const term = (row.searchTerm || '').trim().toLowerCase();
  if (term && (!currentSelected || term !== currentSelected.name.toLowerCase())) {
    list = list.filter(ing => ing.name.toLowerCase().includes(term));
  }

  return list;
}

// Sélection d'un ingrédient dans la liste déroulante
selectIngredient(rowIndex: number, ing: Ingredient): void {
  if (!this.compositionRows[rowIndex]) return;
  this.compositionRows[rowIndex].idIngredient = ing.id;
  this.compositionRows[rowIndex].searchTerm = ing.name;
  this.compositionRows[rowIndex].isOpen = false;
  this.cdr.markForCheck();
}

// Fermeture avec léger délai pour permettre le clic sur une option
closeDropdownWithDelay(rowIndex: number): void {
  setTimeout(() => {
    if (!this.compositionRows[rowIndex]) return;
    this.compositionRows[rowIndex].isOpen = false;
    // Si l'utilisateur a tapé n'importe quoi sans sélectionner, on remet le vrai nom sélectionné
    const currentId = this.compositionRows[rowIndex].idIngredient;
    const selected = this.availableIngredients.find(i => String(i.id) === String(currentId));
    this.compositionRows[rowIndex].searchTerm = selected ? selected.name : '';
    this.cdr.markForCheck();
  }, 200);
}
}
