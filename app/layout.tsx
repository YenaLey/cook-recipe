import { Acme } from "@next/font/google";
import "./globals.css";
import Navbar from "@components/navbar";

const acme = Acme({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "CookMate",
  description: "Generated by create next app",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={acme.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
