import { Ingredient } from "./ingredients";

export interface Recette {
  id: number;
  name: string;
  description: string;
  composition: Ingredient[];
}

