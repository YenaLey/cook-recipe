import Category from "@components/category";

async function getCategories() {
  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();
  return <Category categories={categories} />;
}
