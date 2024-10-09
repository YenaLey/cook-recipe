import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");

    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read db.json", error);
    return NextResponse.json(
      { error: "Failed to load menus" },
      { status: 500 }
    );
  }
}
