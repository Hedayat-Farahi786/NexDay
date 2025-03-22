
import { useState } from "react";
import { useChecklist, HistoryEntry, Task, TaskCategory } from "@/contexts/ChecklistContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Pencil, Save, CheckCircle, BookOpen, Heart, Lightbulb, Share2, Smile, Activity } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Dynamically import Lucide icons
const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};

interface HistoryDetailProps {
  entry: HistoryEntry;
}

const HistoryDetail = ({ entry }: HistoryDetailProps) => {
  const { editHistoryEntry } = useChecklist();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState<HistoryEntry>({ ...entry });
  
  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes
      editHistoryEntry(editedEntry);
      setIsEditing(false);
    } else {
      // Enter edit mode
      setIsEditing(true);
    }
  };
  
  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setEditedEntry(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: checked } : task
      )
    }));
  };
  
  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...editedEntry.gratitudes];
    newGratitudes[index] = value;
    setEditedEntry(prev => ({ ...prev, gratitudes: newGratitudes }));
  };
  
  const handleLessonChange = (value: string) => {
    setEditedEntry(prev => ({ ...prev, lesson: value }));
  };
  
  const handleMoodChange = (value: number) => {
    setEditedEntry(prev => ({ ...prev, mood: value }));
  };
  
  const handleProductivityChange = (value: number) => {
    setEditedEntry(prev => ({ ...prev, productivity: value }));
  };
  
  const getTasksByCategory = (category: TaskCategory) => {
    return (isEditing ? editedEntry.tasks : entry.tasks).filter(task => task.category === category);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const getMoodEmoji = (value: number) => {
    if (value <= 3) return "😔";
    if (value <= 6) return "😐";
    if (value <= 8) return "🙂";
    return "😄";
  };

  const getProductivityEmoji = (value: number) => {
    if (value <= 3) return "🐌";
    if (value <= 6) return "🚶";
    if (value <= 8) return "🏃";
    return "🚀";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {formatDate(entry.date)}
        </p>
        <Button 
          variant={isEditing ? "default" : "outline"} 
          onClick={handleToggleEdit}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Entry
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Protocol Tasks */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Protocol</h2>
          </div>
          <div className="space-y-2">
            {getTasksByCategory("protocol").map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                isEditing={isEditing}
                onToggle={handleTaskToggle}
              />
            ))}
          </div>
        </div>
        
        {/* Main Tasks */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Main</h2>
          </div>
          <div className="space-y-2">
            {getTasksByCategory("main").map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                isEditing={isEditing}
                onToggle={handleTaskToggle}
              />
            ))}
          </div>
        </div>
        
        {/* Outreach Tasks */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Outreach</h2>
          </div>
          <div className="space-y-2">
            {getTasksByCategory("outreach").map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                isEditing={isEditing}
                onToggle={handleTaskToggle}
              />
            ))}
          </div>
        </div>
        
        {/* Gratitude */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Grateful For</h2>
          </div>
          <div className="space-y-3">
            {(isEditing ? editedEntry.gratitudes : entry.gratitudes).map((gratitude, index) => (
              <div key={index} className="relative">
                <div className="absolute left-3 top-3 flex items-center justify-center rounded-full w-5 h-5 bg-primary text-primary-foreground text-xs font-medium">
                  {index + 1}
                </div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={gratitude}
                    onChange={(e) => handleGratitudeChange(index, e.target.value)}
                    placeholder={`I am grateful for...`}
                    className="w-full px-10 py-2.5"
                  />
                ) : (
                  <div className="w-full px-10 py-2.5 rounded-md border bg-muted/10">
                    {gratitude || "No gratitude recorded"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Lesson */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Today's Lesson</h2>
          </div>
          {isEditing ? (
            <Textarea
              value={editedEntry.lesson}
              onChange={(e) => handleLessonChange(e.target.value)}
              placeholder="What did you learn today?"
              className="w-full h-[130px] resize-none"
            />
          ) : (
            <div className="w-full h-[130px] p-3 rounded-md border bg-muted/10 overflow-y-auto">
              {entry.lesson || "No lesson recorded"}
            </div>
          )}
        </div>
        
        {/* Mood & Productivity */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium">Daily Metrics</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium">Mood</h4>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {getMoodEmoji(isEditing ? editedEntry.mood : entry.mood)}
                  </span>
                  <span className="text-xl font-medium">
                    {isEditing ? editedEntry.mood : entry.mood}/10
                  </span>
                </div>
              </div>
              
              {isEditing && (
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editedEntry.mood}
                  onChange={(e) => handleMoodChange(parseInt(e.target.value))}
                  className="w-full"
                />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium">Productivity</h4>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">
                    {getProductivityEmoji(isEditing ? editedEntry.productivity : entry.productivity)}
                  </span>
                  <span className="text-xl font-medium">
                    {isEditing ? editedEntry.productivity : entry.productivity}/10
                  </span>
                </div>
              </div>
              
              {isEditing && (
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={editedEntry.productivity}
                  onChange={(e) => handleProductivityChange(parseInt(e.target.value))}
                  className="w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

const TaskItem = ({ task, isEditing, onToggle }: TaskItemProps) => {
  const handleToggle = () => {
    if (isEditing) {
      onToggle(task.id, !task.isCompleted);
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 p-2 rounded-md ${isEditing ? 'cursor-pointer hover:bg-muted/20' : ''}`}
      onClick={handleToggle}
    >
      <div 
        className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center
          ${task.isCompleted 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'border-muted-foreground'
          }
        `}
      >
        {task.isCompleted && <CheckCircle className="w-4 h-4" />}
      </div>
      
      <div className="flex items-center gap-2">
        <Icon name={task.icon} className="w-4 h-4 text-primary" />
        <span className={task.isCompleted ? 'line-through text-muted-foreground' : ''}>
          {task.label}
        </span>
      </div>
    </div>
  );
};

export default HistoryDetail;
