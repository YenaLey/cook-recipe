"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Category } from "types/types";

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchRecipes = async (category: string) => {
    router.push(`/menu?category=${category}`);
  };

  return (
    <div className="home-container">
      <h1>Choose a Category!</h1>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.idCategory}
            onClick={() => fetchRecipes(category.strCategory)}
          >
            <p>{category.strCategory}</p>
            <Image
              src={category.strCategoryThumb}
              alt={category.strCategory}
              width={150}
              height={100}
            />
          </div>
        ))
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
}
