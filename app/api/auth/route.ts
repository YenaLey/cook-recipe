import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma";
import { sendVerificationEmail } from "../../lib/email";

// 회원가입
export async function POST(req: Request) {
  const { email, name, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign(
    { email, name, password: hashedPassword },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "이미 존재하는 이메일입니다." },
        { status: 400 }
      );
    }

    await sendVerificationEmail(email, verificationToken);
    return NextResponse.json({
      message:
        "회원가입을 위해 이메일 인증을 완료하세요. 이메일을 확인해주세요.",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "회원가입 실패", error },
      { status: 400 }
    );
  }
}

// 로그인
export async function login(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "이메일 인증이 완료되지 않았습니다." },
        { status: 403 }
      );
    }

    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });
    return NextResponse.json({ message: "로그인 성공", token });
  } catch (error) {
    return NextResponse.json(
      { message: "로그인 실패", error },
      { status: 500 }
    );
  }
}

// 이메일 인증
export async function verifyEmail(req: Request) {
  const { token } = await req.json();

  try {
    const decoded = jwt.verify(token, "your-secret-key") as {
      email: string;
      name: string;
      password: string;
    };

    const user = await prisma.user.create({
      data: {
        name: decoded.name,
        email: decoded.email,
        password: decoded.password,
        isVerified: true,
        verificationToken: null,
      },
    });

    return NextResponse.json({
      message: "이메일 인증 및 회원가입 완료.",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "잘못된 또는 만료된 토큰입니다." },
      { status: 400 }
    );
  }
}

// 사용자 정보 조회
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "인증이 필요합니다." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "your-secret-key") as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { message: "잘못된 인증 정보입니다." },
      { status: 401 }
    );
  }
}
