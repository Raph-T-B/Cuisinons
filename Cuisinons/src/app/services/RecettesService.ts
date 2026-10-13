import { Recette } from "../model/recettes"
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { inject,Injectable } from "@angular/core";
@Injectable({
  providedIn:'root'
})
export class RecettesServices{
  private API_URL:URL =new URL('https://6ab976bcf84897980b729a5b.mockapi.io/recipies');
  private http = inject(HttpClient);
  list(){
    // Implementation for listing recipes
    return this.http.get<Recette[]>(String(this.API_URL));
  }
  addRecette(recette: Recette) {
    // Implementation for adding a recipe
    return this.http.post<Recette>(String(this.API_URL), recette);
  }
  findBy(name: string) {
    // Implementation for finding a recipe by name
    //return this.http.get<Recette>(this.API_URL);

    return this.http.get<Recette>(String(this.API_URL) + '?title=' + name);
  }
}



