"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  return (
    <div className="navbar">
      <p onClick={goToHome}>CookMate</p>
    </div>
  );
}
