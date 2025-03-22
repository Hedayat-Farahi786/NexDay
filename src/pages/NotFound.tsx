
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6 bg-card border border-border rounded-xl shadow-sm animate-fade-in">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl mb-6">Oops! We couldn't find that page.</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-all hover:bg-primary/90"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
