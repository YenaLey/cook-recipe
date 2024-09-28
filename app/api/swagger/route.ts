import { NextRequest, NextResponse } from "next/server";
import swaggerDocument from "../../swagger.json"; // 루트 경로에 있는 swagger.json 파일

// GET 요청을 처리하는 named export
export async function GET(req: NextRequest) {
  return NextResponse.json(swaggerDocument);
}
