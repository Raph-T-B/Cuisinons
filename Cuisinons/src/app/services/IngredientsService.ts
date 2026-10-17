import { Ingredient } from "../models/ingredients";
import { HttpClient } from "@angular/common/http";
import {inject,Injectable} from "@angular/core"
@Injectable({
  providedIn:'root'
})
export class IngredientsService{
  private http = inject(HttpClient);
  private API_URL=new URL('https://6ab976bcf84897980b729a5b.mockapi.io/ingredients');
  list(){
    return this.http.get<Ingredient[]>(String(this.API_URL));
  }
  addIngredients(ingredient: Ingredient) {
    return this.http.post<Ingredient>(String(this.API_URL), ingredient);
  }
  findBy(name: string) {
    return this.http.get<Ingredient>(String(this.API_URL) + '?name=' + name);
  }
}
