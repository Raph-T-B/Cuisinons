import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RecettesService } from '../../services/RecettesService';
import { Recette } from '../../models/recettes';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TruncatePipe],
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {
  recipes: Recette[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 6;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private recettesServ: RecettesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recettesServ.liste().subscribe({
      next: (data) => {
        this.recipes = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API recettes:', err);
        this.errorMessage = 'Impossible de charger la liste des recettes.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get filteredRecipes(): Recette[] {
    if (!this.searchTerm.trim()) {
      return this.recipes;
    }
    const query = this.searchTerm.trim().toLowerCase();
    return this.recipes.filter(r => r.name?.toLowerCase().includes(query));
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRecipes.length / this.pageSize));
  }

  get paginatedRecipes(): Recette[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecipes.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getMoyenneNotes(recipe: Recette): number | null {
    return this.recettesServ.getRecipeAverage(recipe);
  }
}
