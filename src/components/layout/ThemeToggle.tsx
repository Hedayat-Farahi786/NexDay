
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      toast.success("Light mode activated");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      toast.success("Dark mode activated");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative p-2 rounded-full transition-all duration-300",
        "hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50",
        "group overflow-hidden"
      )}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform animate-fade-in" />
      ) : (
        <Moon className="h-5 w-5 text-primary transition-transform animate-fade-in" />
      )}
      <span className="sr-only">{isDarkMode ? "Light mode" : "Dark mode"}</span>
      <div className={cn(
        "absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-10",
        { "bg-yellow-400": isDarkMode, "bg-primary": !isDarkMode }
      )} />
    </button>
  );
};

export default ThemeToggle;
