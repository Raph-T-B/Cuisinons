import { IngredientRecette } from "./ingredient-recette";
import { Note } from "./note";

export interface Recette {
  id: number;
  name: string;
  description: string;
  composition: IngredientRecette[];
  notes : Note[];
}

