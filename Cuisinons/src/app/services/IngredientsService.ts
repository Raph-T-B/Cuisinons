import { Ingredient } from "../models/ingredients";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private http = inject(HttpClient);
  private API_URL = 'https://6ab976bcf84897980b729a5b.mockapi.io/ingredients';

  list(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.API_URL);
  }

  getById(id: string | number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.API_URL}/${id}`);
  }

  addIngredients(ingredient: Partial<Ingredient>): Observable<Ingredient> {
    return this.http.post<Ingredient>(this.API_URL, ingredient);
  }

  findBy(name: string): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.API_URL}?name=${encodeURIComponent(name)}`);
  }
}
