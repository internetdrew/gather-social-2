import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  return (
    <nav className="fixed flex w-full items-center justify-between p-4 text-center">
      <Link to="/" className="font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-gallery-horizontal-end-icon lucide-gallery-horizontal-end mr-1.5 inline size-4 text-pink-600"
        >
          <path d="M2 7v10" />
          <path d="M6 5v14" />
          <rect width="12" height="18" x="10" y="3" rx="2" />
        </svg>
        Gather Social
      </Link>
      <ThemeToggle />
    </nav>
  );
};

export default Navbar;
