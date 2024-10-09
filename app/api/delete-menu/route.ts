import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");

    // 기존 db.json 파일 읽기
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // 클라이언트에서 전송한 mealId를 가져옴
    const body = await req.json();
    const mealId = body.mealId;

    // 해당 mealId를 가진 메뉴를 삭제
    const updatedMenus = data.menus.filter(
      (menu: any) => menu.idMeal !== mealId
    );

    // 변경된 데이터를 다시 db.json에 저장
    data.menus = updatedMenus;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "Menu deleted successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete menu." },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
