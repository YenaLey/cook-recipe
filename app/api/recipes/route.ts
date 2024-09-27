import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cuisine = searchParams.get("cuisine");

  if (!cuisine) {
    return NextResponse.json(
      { message: "Cuisine is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cuisine}`
    );
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { message: data.message },
        { status: response.status }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
