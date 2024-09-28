import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `http://localhost:3000/api/auth?token=${token}&action=verify`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "이메일 인증",
    html: `<p>이메일 인증을 완료하려면 다음 링크를 클릭하세요: <a href="${verificationUrl}">인증하기</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}
