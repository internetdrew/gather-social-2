import { Link } from "react-router";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { supabaseBrowserClient } from "@/lib/supabase";

const Navbar = () => {
  const { user } = useAuth();

  const signOut = async () => {
    await supabaseBrowserClient.auth.signOut();
  };

  return (
    <nav className="bg-background sticky top-0 z-50 flex w-full items-center justify-between p-4 text-center">
      <Link to="/" className="font-semibold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-gallery-horizontal-end-icon lucide-gallery-horizontal-end mr-1.5 inline size-4 text-pink-600"
        >
          <path d="M2 7v10" />
          <path d="M6 5v14" />
          <rect width="12" height="18" x="10" y="3" rx="2" />
        </svg>
        Gather <span className="font-light">Social</span>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-7">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>
                  {user.user_metadata.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
