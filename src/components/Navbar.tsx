import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="fixed flex w-full items-center justify-between p-4 text-center">
      <Link to="/" className="font-semibold">
        Gather Social
      </Link>
    </nav>
  );
};

export default Navbar;
