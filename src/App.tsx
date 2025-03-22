
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChecklistProvider } from "./contexts/ChecklistContext";
import Index from "./pages/Index";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import AppSidebar from "./components/layout/AppSidebar";
import Landing from "./pages/Landing";
import { useState, useEffect } from "react";
import { SidebarProvider } from "./components/ui/sidebar";
import Tour from "./components/onboarding/TourStep";

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would be determined by an auth context
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showTour, setShowTour] = useState(false);
  
  // Check if this is the first time the user visits
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("tour-completed");
    if (!hasCompletedTour && hasOnboarded) {
      // Wait a bit before showing the tour
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasOnboarded]);
  
  const handleCompleteTour = () => {
    localStorage.setItem("tour-completed", "true");
    setShowTour(false);
  };
  
  // Define tour steps
  const tourSteps = [
    {
      title: "Welcome to Daily Checklist",
      description: "Let's take a quick tour to help you get started",
      target: ".navbar-logo",
      position: "bottom" as const,
      action: "Click on the logo to begin",
      waitForClick: true
    },
    {
      title: "Task Lists",
      description: "Here you'll find your daily tasks organized by category",
      target: ".task-list-protocol",
      position: "right" as const,
      action: "Click on a task to mark it as completed",
      waitForClick: true
    },
    {
      title: "Gratitude Journaling",
      description: "Record things you're grateful for each day",
      target: ".gratitude-card",
      position: "top" as const,
      action: "Click here to start writing",
      waitForClick: true
    },
    {
      title: "Date Navigation",
      description: "You can navigate between different days using these controls",
      target: ".date-navigation",
      position: "bottom" as const,
      action: "Try clicking on a date",
      waitForClick: true
    },
    {
      title: "Add Custom Tasks",
      description: "You can add your own custom tasks to any category",
      target: ".custom-task-button",
      position: "top" as const,
      action: "Click to try adding a task",
      waitForClick: true
    }
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ChecklistProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/landing" element={<Landing onComplete={() => setHasOnboarded(true)} />} />
              
              <Route
                path="/"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col">
                        <Navbar />
                        <Index />
                      </div>
                      
                      {/* Onboarding Tour */}
                      {showTour && (
                        <Tour 
                          steps={tourSteps}
                          isOpen={showTour}
                          onClose={() => setShowTour(false)}
                          onComplete={handleCompleteTour}
                        />
                      )}
                    </div>
                  </SidebarProvider>
                }
              />
              
              <Route
                path="/history"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col">
                        <Navbar />
                        <History />
                      </div>
                    </div>
                  </SidebarProvider>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col">
                        <Navbar />
                        <Settings />
                      </div>
                    </div>
                  </SidebarProvider>
                }
              />
              
              {/* Initial redirect */}
              <Route 
                path="/" 
                element={<Navigate to={hasOnboarded ? "/" : "/landing"} replace />} 
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChecklistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
