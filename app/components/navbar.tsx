"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  const goToMypage = () => {
    router.push("/mypage");
  };

  return (
    <div className="navbar">
      <h1 onClick={goToHome}>CookMate</h1>
      <p onClick={goToMypage}>My Page</p>
    </div>
  );
}
