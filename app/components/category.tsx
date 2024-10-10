"use client"; // 클라이언트 컴포넌트로 지정

import { useRouter } from "next/navigation";
import Image from "next/image";

type CategoryProps = {
  categories: CategoryType[] | null;
};

export default function Category({ categories }: CategoryProps) {
  const router = useRouter();

  const fetchRecipes = (category: string) => {
    router.push(`/menu?category=${category}`);
  };

  return (
    <div className="home-container">
      <h1>Choose a Category!</h1>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <div key={category.idCategory}>
            <p onClick={() => fetchRecipes(category.strCategory)}>
              {category.strCategory}
            </p>
            <Image
              src={category.strCategoryThumb}
              alt={category.strCategory}
              width={150}
              height={100}
            />
          </div>
        ))
      ) : (
        <p>Failed to load categories. Please try again later.</p>
      )}
    </div>
  );
}
