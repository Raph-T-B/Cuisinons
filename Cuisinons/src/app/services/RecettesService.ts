import { Recette } from "../models/recettes";
import { Note } from "../models/note";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecettesService {
  private API_URL = 'https://6ab976bcf84897980b729a5b.mockapi.io/recipies';
  private http = inject(HttpClient);

  liste(): Observable<Recette[]> {
    return this.http.get<Recette[]>(this.API_URL);
  }

  getById(id: string | number): Observable<Recette> {
    return this.http.get<Recette>(`${this.API_URL}/${id}`);
  }

  getLatestRecipes(count: number = 5): Observable<Recette[]> {
    return this.liste().pipe(
      map(recipes => {
        return [...recipes]
          .sort((a, b) => {
            const idA = Number(a.id) || 0;
            const idB = Number(b.id) || 0;
            return idB - idA;
          })
          .slice(0, count);
      })
    );
  }

  AjtRecette(recette: Recette): Observable<Recette> {
    return this.http.post<Recette>(this.API_URL, recette);
  }

  updateRecette(id: string | number, recette: Partial<Recette>): Observable<Recette> {
    return this.http.put<Recette>(`${this.API_URL}/${id}`, recette);
  }

  addReview(recipeId: string | number, currentRates: Note[] = [], newReview: Note): Observable<Recette> {
    const updatedRates = [...currentRates, newReview];
    return this.updateRecette(recipeId, { rates: updatedRates });
  }

  findBy(name: string): Observable<Recette[]> {
    return this.http.get<Recette[]>(`${this.API_URL}?name=${encodeURIComponent(name)}`);
  }

  MoyenneNotes(notes?: Note[]): number | null {
    if (!notes || notes.length === 0) {
      return null;
    }
    let total = 0;
    let count = 0;
    for (let i = 0; i < notes.length; i++) {
      const val = notes[i].rate ?? notes[i].rating;
      if (typeof val === 'number' && !isNaN(val)) {
        total += val;
        count++;
      }
    }
    if (count === 0) return null;
    return Math.round((total / count) * 10) / 10;
  }

  getRecipeAverage(recipe: Recette): number | null {
    return this.MoyenneNotes(recipe.rates || recipe.notes);
  }
}
