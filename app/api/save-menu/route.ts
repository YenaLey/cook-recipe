import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "data", "db.json");

    // 기존의 db.json 파일 읽기
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    // 요청에서 보낸 데이터
    const body = await req.json();

    // 이미 저장된 메뉴인지 확인 (idMeal을 기준으로 확인)
    const isDuplicate = data.menus.some(
      (menu: any) => menu.idMeal === body.idMeal
    );

    if (isDuplicate) {
      return NextResponse.json(
        { error: "이미 저장되어있습니다." },
        { status: 400 }
      );
    } else {
      // 중복이 아니면 새로운 메뉴를 추가
      data.menus.push(body);
    }

    // 수정된 데이터를 다시 db.json에 저장
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ message: "Menu saved successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save menu." },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
