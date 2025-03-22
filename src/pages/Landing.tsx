import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckSquare, ArrowRight, Calendar, LineChart, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface LandingProps {
  onComplete: () => void;
}

const Landing = ({ onComplete }: LandingProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const startApp = () => {
    setIsLoading(true);
    // Simulate login/signup process
    setTimeout(() => {
      onComplete();
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <CheckSquare className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">Daily Checklist</span>
          </div>
          <div>
            <Button variant="outline" className="mr-2" onClick={startApp}>Log in</Button>
            <Button onClick={startApp}>Sign up</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="flex-1 container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Track your daily habits and boost productivity
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Build consistency with our simple daily checklist app that helps you focus on what matters most.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button size="lg" onClick={startApp} disabled={isLoading}>
                {isLoading ? "Loading..." : "Get Started for Free"}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-primary mr-2" />
                <span>Track daily habits</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <span>View progress over time</span>
              </div>
              <div className="flex items-center">
                <LineChart className="h-5 w-5 text-primary mr-2" />
                <span>Detailed analytics</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <span>Daily reflection prompts</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="rounded-lg border bg-card p-8 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Heart className="h-5 w-5 text-primary mr-2" />
                Daily Protocol
              </h3>
              <div className="space-y-2">
                {["Meditate for 10 mins", "Drink 8 glasses of water", "Read for 30 mins", "Exercise", "Journal"].map((item, i) => (
                  <div key={i} className="flex items-center rounded-md border p-3">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${i < 3 ? 'bg-primary border-primary' : 'border-muted'}`}>
                      {i < 3 && <CheckCircle className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className="ml-3">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Daily Checklist. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
