import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../prisma/prisma";
import { sendVerificationEmail } from "../../lib/email";

export async function signup(req: NextApiRequest, res: NextApiResponse) {
  const { email, name, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign(
    { email, name, password: hashedPassword },
    "your-secret-key",
    { expiresIn: "1h" }
  );

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "이미 존재하는 이메일입니다." });
    }

    await sendVerificationEmail(email, verificationToken);
    res.status(200).json({
      message:
        "회원가입을 위해 이메일 인증을 완료하세요. 이메일을 확인해주세요.",
    });
  } catch (error) {
    res.status(400).json({ message: "회원가입 실패", error });
  }
}

export async function login(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "이메일 인증이 완료되지 않았습니다." });
    }

    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "로그인 성공", token });
  } catch (error) {
    res.status(500).json({ message: "로그인 실패", error });
  }
}

export async function verifyEmail(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

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

    res.status(200).json({ message: "이메일 인증 및 회원가입 완료.", user });
  } catch (error) {
    res.status(400).json({ message: "잘못된 또는 만료된 토큰입니다." });
  }
}

export async function getUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "인증이 필요합니다." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "your-secret-key") as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "사용자 정보를 찾을 수 없습니다." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "잘못된 인증 정보입니다." });
  }
}
