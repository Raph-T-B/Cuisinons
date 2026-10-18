import { IngredientRecette } from "./ingredient-recette";
import { Note } from "./note";

export interface Recette {
  id?: string | number;
  name: string;
  description: string;
  composition: IngredientRecette[];
  rates?: Note[];
  notes?: Note[];
}
