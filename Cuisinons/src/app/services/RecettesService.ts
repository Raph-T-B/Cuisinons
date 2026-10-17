import { Recette } from "../models/recettes"
import { Note } from "../models/note"
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from 'rxjs';
import { inject,Injectable } from "@angular/core";
@Injectable({
  providedIn:'root'
})
export class RecettesService{
  private API_URL:URL =new URL('https://6ab976bcf84897980b729a5b.mockapi.io/recipies');
  private http = inject(HttpClient);

  liste(){
    return this.http.get<Recette[]>(String(this.API_URL));
  }

  AjtRecette(recette: Recette) {
    return this.http.post<Recette>(String(this.API_URL), recette);
  }

  findBy(name: string) {
    return this.http.get<Recette>(String(this.API_URL) + '?title=' + name);
  }

  MoyenneNotes(notes : Note[]){
    let total : number =0;
    for (let i : number = 0; i<notes.length ; i++){
      total+=notes[i].rating;
    }
    return total/notes.length
  }
}



