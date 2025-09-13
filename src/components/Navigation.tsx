import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", active: location.pathname === "/" },
    { path: "/upload", label: "Upload Data", active: location.pathname === "/upload" },
    { path: "/results", label: "View Results", active: location.pathname === "/results" },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-finance-primary"></div>
            <span className="text-xl font-bold text-finance-primary">FinanceMatch</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  item.active ? "text-finance-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="default" className="ml-4">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;