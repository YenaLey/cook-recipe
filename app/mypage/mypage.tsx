"use client";

import Image from "next/image";
import { Menu as MenuType, Recipe } from "@customTypes/types";
import { useEffect, useState } from "react";
import { FaHeartCircleMinus } from "react-icons/fa6";

// 메뉴 데이터 가져오기
async function getMenus() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
  try {
    const res = await fetch(`${BASE_URL}/api/get-menu`);
    const data = await res.json();
    return data.menus || [];
  } catch {
    console.error("Failed to fetch menus");
    return [];
  }
}

// 개별 레시피 정보 가져오기
async function fetchRecipeDetails(mealId: string) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch recipe details");
    }
    const data = await res.json();
    return data.meals[0]; // 레시피 정보 반환
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function Mypage() {
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

  // 메뉴 및 각 메뉴의 레시피 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 모든 메뉴 가져오기
        const menusData = await getMenus();
        setMenus(menusData);

        // 모든 메뉴의 레시피 정보를 Promise.all로 병렬로 가져오기
        const recipePromises = menusData.map((menu: MenuType) =>
          fetchRecipeDetails(menu.idMeal)
        );
        const recipesData = await Promise.all(recipePromises);
        setRecipes(recipesData.filter((recipe) => recipe !== null)); // null 체크 후 설정
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (mealId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/delete-menu`, {
        method: "DELETE", // DELETE 메서드 사용
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mealId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete menu");
      }

      // 삭제가 성공한 후 메뉴 목록을 다시 가져옴
      const updatedMenus = await getMenus();
      setMenus(updatedMenus);

      // 메뉴 삭제 후, 관련 레시피도 삭제
      const recipePromises = updatedMenus.map((menu: MenuType) =>
        fetchRecipeDetails(menu.idMeal)
      );
      const updatedRecipes = await Promise.all(recipePromises);
      setRecipes(updatedRecipes.filter((recipe) => recipe !== null));
    } catch (error: any) {
      alert(error.message);
    }
  };
  if (isLoading) {
    return (
      <div className="mypage-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <h2>View My Menu</h2>
      {menus && menus.length > 0 ? (
        menus.map((menu: MenuType, index: number) => {
          const recipe = recipes[index];
          return (
            <div key={menu.idMeal} className="mypage-menu-block">
              <FaHeartCircleMinus
                className="minus-icon"
                onClick={() => handleDelete(menu.idMeal)}
              />
              <div className="mypage-menu-block-left">
                <h3>{menu.strMeal}</h3>
                <Image
                  src={menu.strMealThumb}
                  alt={menu.strMeal}
                  width={140}
                  height={140}
                />
              </div>
              {recipe && (
                <>
                  <div className="mypage-menu-block-right">
                    <p>{recipe.strInstructions}</p>
                  </div>
                  <div className="mypage-menu-block-bottom">
                    <a
                      href={recipe.strYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Youtube
                    </a>
                    <a
                      href={recipe.strSource}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source
                    </a>
                  </div>
                </>
              )}
            </div>
          );
        })
      ) : (
        <h6>empty...</h6>
      )}
    </div>
  );
}
