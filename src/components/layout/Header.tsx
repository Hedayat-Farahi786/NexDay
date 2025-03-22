
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 py-4",
        "backdrop-blur-xl bg-background/70 border-b",
        scrolled ? "border-border shadow-sm" : "border-transparent"
      )}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold">Daily Checklist</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{format(currentDate, "EEEE, ")}</span>
            <span>{format(currentDate, "dd.MM.yyyy")}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
