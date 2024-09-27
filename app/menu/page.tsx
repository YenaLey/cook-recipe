"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu as MenuType, Recipe } from "types/types";

export default function Menu() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [menus, setMenus] = useState<MenuType[] | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await fetch(`/api/recipes?cuisine=${category}`);
      if (!res.ok) {
        console.error("Failed to fetch recipes");
        return;
      }
      const data = await res.json();
      console.log(data.meals);
      setMenus(data.meals || []);
    };

    if (category) {
      fetchMenu();
    }
  }, [category]);

  const fetchRecipeDetails = async (mealId: string) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!res.ok) {
      console.error("Failed to fetch recipe details");
      return;
    }
    const data = await res.json();
    setRecipe(data.meals[0]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderIngredients = () => {
    const ingredients = [];
    if (recipe) {
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient?.trim()) {
          ingredients.push(
            <li key={i}>
              {ingredient} - {measure}
            </li>
          );
        }
      }
    }
    return ingredients;
  };

  return (
    <>
      <div className="menu-container">
        <h2>{category} Menu</h2>
        {menus && menus.length > 0 ? (
          menus.map((menu: MenuType) => (
            <div key={menu.idMeal}>
              <Image
                src={menu.strMealThumb}
                alt={menu.strMeal}
                width={140}
                height={140}
                onClick={() => fetchRecipeDetails(menu.idMeal)}
              />
              <h3>{menu.strMeal}</h3>
            </div>
          ))
        ) : (
          <p>로딩 중...</p>
        )}
      </div>
      {isModalOpen && recipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="modal-close">
              X
            </button>
            <h2>{recipe.strMeal}</h2>
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              width={200}
              height={200}
            />
            <h3>Instructions</h3>
            <p style={{ textAlign: "start" }}>{recipe.strInstructions}</p>
            <ul>
              <h3>Ingredients</h3>
              {renderIngredients()}
            </ul>
            {recipe.strYoutube && (
              <div>
                <h3>Watch the Recipe on YouTube</h3>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${
                    recipe.strYoutube.split("=")[1]
                  }`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={recipe.strMeal}
                ></iframe>
              </div>
            )}
            {/* 출처 링크 표시 */}
            {recipe.strSource && (
              <p>
                <a
                  href={recipe.strSource}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Recipe Source
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
