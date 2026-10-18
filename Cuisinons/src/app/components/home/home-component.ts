import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate-pipe';
import { RecettesService } from '../../services/RecettesService';
import { Recette } from '../../models/recettes';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [RouterLink, TruncatePipe],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit {
  recettes: Recette[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private recettesServ: RecettesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.recettesServ.getLatestRecipes(5).subscribe({
      next: (data) => {
        this.recettes = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Impossible de charger les recettes pour le moment.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getMoyenneNotes(recipe: Recette): number | null {
    return this.recettesServ.getRecipeAverage(recipe);
  }
}
