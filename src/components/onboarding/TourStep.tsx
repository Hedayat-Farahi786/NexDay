
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

type TourStep = {
  title: string;
  description: string;
  target: string;
  position: "top" | "right" | "bottom" | "left" | "center";
  action?: string; // Text to show for the action (e.g., "Click here")
  waitForClick?: boolean; // Whether to wait for user to click on target
};

type TourProps = {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
};

const Tour = ({ steps, isOpen, onClose, onComplete }: TourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [waitingForClick, setWaitingForClick] = useState(false);
  
  // Reference to the overlay
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Create a cutout effect around the target element
  const highlightTarget = () => {
    const step = steps[currentStep];
    if (!step) return;
    
    const target = document.querySelector(step.target) as HTMLElement;
    if (!target) return;
    
    // Get the target's dimensions and position
    const rect = target.getBoundingClientRect();
    
    // Add a highlight effect to the target
    target.style.position = 'relative';
    target.style.zIndex = '60';
    target.style.pointerEvents = 'auto';
    
    // If we're waiting for a click, add a pulse animation
    if (step.waitForClick) {
      target.classList.add('animate-pulse');
      setWaitingForClick(true);
      
      // Add click event listener to the target
      const clickHandler = () => {
        target.classList.remove('animate-pulse');
        target.style.zIndex = '';
        setWaitingForClick(false);
        handleNext();
      };
      
      target.addEventListener('click', clickHandler, { once: true });
      
      // Clean up function
      return () => {
        target.removeEventListener('click', clickHandler);
        target.classList.remove('animate-pulse');
        target.style.zIndex = '';
      };
    }
    
    return () => {
      target.style.position = '';
      target.style.zIndex = '';
      target.style.pointerEvents = '';
    };
  };
  
  useEffect(() => {
    if (!isOpen) return;
    
    positionTooltip();
    const cleanup = highlightTarget();
    
    // Reposition on window resize
    window.addEventListener('resize', positionTooltip);
    return () => {
      window.removeEventListener('resize', positionTooltip);
      if (cleanup) cleanup();
    };
  }, [isOpen, currentStep]);
  
  const positionTooltip = () => {
    const step = steps[currentStep];
    if (!step) return;
    
    const target = document.querySelector(step.target);
    if (!target) {
      // If target not found, center in viewport
      setPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 150,
      });
      return;
    }
    
    const rect = target.getBoundingClientRect();
    let top = 0;
    let left = 0;
    
    switch (step.position) {
      case "top":
        top = rect.top - 120;
        left = rect.left + rect.width / 2 - 150;
        break;
      case "right":
        top = rect.top + rect.height / 2 - 60;
        left = rect.right + 20;
        break;
      case "bottom":
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2 - 150;
        break;
      case "left":
        top = rect.top + rect.height / 2 - 60;
        left = rect.left - 320;
        break;
      case "center":
        top = rect.top + rect.height / 2 - 60;
        left = rect.left + rect.width / 2 - 150;
        break;
    }
    
    // Ensure tooltip stays within viewport
    top = Math.max(10, Math.min(top, window.innerHeight - 180));
    left = Math.max(10, Math.min(left, window.innerWidth - 320));
    
    setPosition({ top, left });
  };
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semitransparent overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />
      
      <AnimatePresence>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          style={{ 
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: 300
          }}
          className="pointer-events-auto z-60"
        >
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {steps[currentStep].title}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
              {steps[currentStep].action && (
                <div className="mt-2 p-2 bg-muted rounded-md text-sm font-medium flex items-center justify-center">
                  {steps[currentStep].action}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {Array.from({ length: steps.length }).map((_, i) => (
                  <span 
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      currentStep === i ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleNext}
                  disabled={waitingForClick && steps[currentStep].waitForClick}
                >
                  {currentStep < steps.length - 1 ? (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    "Finish"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tour;
