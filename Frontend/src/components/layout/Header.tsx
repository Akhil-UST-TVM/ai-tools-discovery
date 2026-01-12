import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bot, LayoutDashboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { isAdmin } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          onClick={(e) => {
            // Logout on logo click and go to login page
            e.preventDefault();
            try {
              logout();
            } catch {}
            navigate("/login");
          }}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold">AI ToolHub</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button
              variant={location.pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </Button>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <Button
                variant={location.pathname === "/admin" ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </Link>
          )}

          <Button
            variant={isAdmin ? "default" : "outline"}
            size="sm"
            className={cn("ml-2", isAdmin && "gradient-primary")}
          >
            {isAdmin ? "Admin Mode" : "User Mode"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => {
              try {
                logout();
              } catch {}
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
