"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu as MenuType, Recipe } from "types/types";

export default function Menu() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Seafood";

  const [menus, setMenus] = useState<MenuType[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!menus) {
    return <p>메뉴를 불러올 수 없습니다.</p>;
  }

  useEffect(() => {
    const fetchMenu = async () => {
      setIsLoading(true);
      setError(null); // 에러 상태 초기화
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }
        const data = await res.json();
        setMenus(data.meals || []);
      } catch (err) {
        console.error(err);
        setError("레시피를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchMenu();
    }
  }, [category]);

  const fetchRecipeDetails = async (mealId: string) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch recipe details");
      }
      const data = await res.json();
      setRecipe(data.meals[0]);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("레시피 정보를 불러오는 데 실패했습니다.");
    }
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

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>; // 에러 메시지 표시
  }

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
          <p>메뉴가 없습니다.</p>
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
