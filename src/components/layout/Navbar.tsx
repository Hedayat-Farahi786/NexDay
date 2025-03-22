import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useChecklist } from "@/contexts/ChecklistContext";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(format(new Date(), "HH:mm:ss"));
  const { selectedDate, setSelectedDate } = useChecklist();
  
  // Create a currentDate state that's always in sync with selectedDate
  const [currentDate, setCurrentDate] = useState<Date>(selectedDate || new Date());
  
  // Keep currentDate in sync with selectedDate
  useEffect(() => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  }, [selectedDate]);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setSelectedDate(date);
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        {/* Left side: Mobile sidebar trigger and breadcrumb */}
        <div className="flex items-center md:gap-2">
          <SidebarTrigger className="md:hidden" />
          
          <div className="hidden md:block">
            {location.pathname === "/" && <span className="text-muted-foreground">Dashboard</span>}
            {location.pathname === "/history" && <span className="text-muted-foreground">History</span>}
            {location.pathname === "/settings" && <span className="text-muted-foreground">Settings</span>}
          </div>
        </div>

        {/* Right side: Date navigation, time and theme toggle */}
        <div className="flex items-center space-x-3">
          <div className="date-navigation flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDay('prev')}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant={isToday(currentDate) ? "default" : "outline"} 
                  className={cn(
                    "flex items-center space-x-2 h-8 px-3",
                    isToday(currentDate) ? "bg-primary text-primary-foreground" : ""
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(currentDate, "EEEE, MMM d")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigateDay('next')}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-sm font-medium">
            {time}
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
