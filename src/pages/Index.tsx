
import { useEffect } from "react";
import TaskList from "@/components/tasks/TaskList";
import MoodTracker from "@/components/mood/MoodTracker";
import GratitudeCard from "@/components/reflection/GratitudeCard";
import LessonCard from "@/components/reflection/LessonCard";
import CustomTaskDialog from "@/components/tasks/CustomTaskDialog";
import { useChecklist } from "@/contexts/ChecklistContext";
import { Heart, Lightbulb, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const {
    updateGratitudes,
    updateLesson,
    updateMoodAndProductivity,
    gratitudes,
    lesson,
    mood,
    productivity,
    selectedDate,
  } = useChecklist();

  // Add fade-in effect when the page loads
  useEffect(() => {
    document.documentElement.classList.add("animate-fade-in");
    return () => {
      document.documentElement.classList.remove("animate-fade-in");
    };
  }, []);

  // Determine if we're viewing today or a past date
  const isViewingPastDate = selectedDate ? 
    new Date(selectedDate.toISOString()).setHours(0,0,0,0) !== new Date().setHours(0,0,0,0) : false;

  return (
    <main className="container flex-1 py-6 px-4 md:py-8 overflow-auto">
      {isViewingPastDate && (
        <div className="mb-6 p-3 bg-muted rounded-md text-sm flex items-center justify-center">
          You are viewing data for {selectedDate?.toLocaleDateString()}. Some actions may be disabled.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Task Lists */}
        <div className="task-list-protocol">
          <TaskList 
            category="protocol" 
            title="Protocol" 
            titleIcon={<Heart className="w-5 h-5" />} 
          />
        </div>
        
        <TaskList 
          category="main" 
          title="Main" 
          titleIcon={<Lightbulb className="w-5 h-5" />} 
        />
        
        <TaskList 
          category="outreach" 
          title="Outreach" 
          titleIcon={<Share2 className="w-5 h-5" />} 
        />
        
        {/* Reflection and Metrics */}
        <div className="gratitude-card">
          <GratitudeCard
            initialValues={gratitudes}
            onChange={updateGratitudes}
          />
        </div>
        
        <LessonCard
          initialValue={lesson}
          onChange={updateLesson}
        />
        
        <MoodTracker
          initialMood={mood}
          initialProductivity={productivity}
          onUpdate={updateMoodAndProductivity}
        />

        {/* Add the CustomTaskDialog in a centered div */}
        {!isViewingPastDate && (
          <div className="col-span-full flex justify-center custom-task-button">
            <CustomTaskDialog />
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;
