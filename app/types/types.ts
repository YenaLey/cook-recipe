export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface Menu {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  strSource?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}
