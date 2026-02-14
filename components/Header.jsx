import Link from "next/link";
import { FaHome } from "react-icons/fa";

export const Header = () => {
  return (
    <nav className="w-screen bg-black p-3 text-white shadow-xl">
      <div className="container mx-auto flex">
        <div className="flex">
          <Link href="/" className="mr-5 flex">
            <FaHome className="mt-1 mr-1" /> Home
          </Link>
        </div>
        <div className="flex ml-auto">
          <Link href={"#about"} className="mr-5">
            About
          </Link>
          <Link href={"#mint"} className="mr-5">
            Mint
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
