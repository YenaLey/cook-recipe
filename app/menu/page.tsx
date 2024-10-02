import dynamic from "next/dynamic";

const Menu = dynamic(() => import("./menu"), { ssr: false });

export default function Page() {
  return <Menu />;
}
