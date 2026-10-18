import { Ingredient } from "../models/ingredients";
import { HttpClient,HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private http = inject(HttpClient);
  private API_URL = 'https://6ab976bcf84897980b729a5b.mockapi.io/ingredients';

  list(searchTerm?: string): Observable<Ingredient[]> {
  let params = new HttpParams()
    .set('sortBy', 'name')
    .set('order', 'asc');

  // Si on passe une recherche, MockAPI filtre dessus
  if (searchTerm && searchTerm.trim().length > 0) {
    params = params.set('name', searchTerm.trim());
  }

  return this.http.get<Ingredient[]>(this.API_URL, { params });
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
