import dynamic from "next/dynamic";

const Mypage = dynamic(() => import("./mypage"), { ssr: false });

export default function Page() {
  return <Mypage />;
}
