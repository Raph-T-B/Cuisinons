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
  recettes: Recette[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private recettesServ: RecettesService) {}

  ngOnInit(): void {
    this.recettesServ.liste().subscribe({
      next: (data) => {
        this.recettes = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.errorMessage = 'Impossible de charger les recettes.';
        this.isLoading = false;
      }
    });
  }

  getMoyenneNotes(recipe: Recette): number | null {
    return this.recettesServ.MoyenneNotes(recipe.notes);
  }
}
