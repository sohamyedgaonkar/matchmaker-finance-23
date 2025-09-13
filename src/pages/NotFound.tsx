import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-finance-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
