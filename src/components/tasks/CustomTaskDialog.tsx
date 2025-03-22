import { useState } from "react";
import { useChecklist, TaskCategory } from "@/contexts/ChecklistContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// List of commonly used icon names to avoid loading all icons which causes errors
const commonIconNames = [
  "Activity", "AlertCircle", "AlertTriangle", "ArrowRight", "Award", 
  "Bell", "Book", "BookOpen", "Brain", "Briefcase", "Calendar", "Check", 
  "CheckCircle", "Clock", "Cloud", "Code", "Coffee", "Compass", "Cpu", 
  "CreditCard", "Droplet", "Edit", "File", "FileText", "Flag", "Folder", 
  "Gift", "Globe", "Heart", "Home", "Image", "Inbox", "Info", "Key", 
  "Layout", "Lightbulb", "Link", "List", "Lock", "Mail", "Map", "MapPin", 
  "Menu", "Message", "MessageCircle", "Monitor", "Moon", "Music", "Package", 
  "Paperclip", "Pencil", "Phone", "Play", "Plus", "Power", "Repeat", "Save", 
  "Search", "Send", "Settings", "Share", "Shield", "ShoppingBag", "Smile", 
  "Speaker", "Star", "Sun", "Table", "Tag", "Target", "Terminal", "ThumbsUp", 
  "Tool", "Trash", "Trophy", "Truck", "Upload", "User", "Users", "Video", 
  "Wallet", "Watch", "Wifi", "X", "Zap", "Circle", "Dumbbell", "Lotus", 
  "BadgeX", "Sparkles", "PenLine", "BrainCircuit", "Headphones"
];

const CustomTaskDialog = () => {
  const { addCustomTask, getAllTaskIds } = useChecklist();
  const [open, setOpen] = useState(false);
  const [taskLabel, setTaskLabel] = useState("");
  const [taskCategory, setTaskCategory] = useState<TaskCategory>("protocol");
  const [taskIcon, setTaskIcon] = useState("Circle");
  const [error, setError] = useState("");
  
  const existingIds = getAllTaskIds();
  
  const handleAddTask = () => {
    if (!taskLabel.trim()) {
      setError("Task label is required");
      return;
    }
    
    const taskId = taskLabel.toLowerCase().replace(/\s+/g, '-');
    
    if (existingIds.includes(taskId)) {
      setError("A task with this name already exists");
      return;
    }
    
    addCustomTask({
      id: taskId,
      label: taskLabel,
      category: taskCategory,
      icon: taskIcon
    });
    
    // Reset form
    setTaskLabel("");
    setTaskCategory("protocol");
    setTaskIcon("Circle");
    setError("");
    setOpen(false);
  };

  // Render the selected icon
  const SelectedIcon = LucideIcons[taskIcon as keyof typeof LucideIcons] as React.FC<any>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Custom Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Task</DialogTitle>
          <DialogDescription>
            Create a new task for your daily checklist. This task will appear in your selected category.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="task-label">Task Name</Label>
            <Input
              id="task-label"
              value={taskLabel}
              onChange={(e) => {
                setTaskLabel(e.target.value);
                setError("");
              }}
              placeholder="Enter task name"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="task-category">Category</Label>
            <Select value={taskCategory} onValueChange={(value) => setTaskCategory(value as TaskCategory)}>
              <SelectTrigger id="task-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protocol">Protocol</SelectItem>
                <SelectItem value="main">Main</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="task-icon">Icon</Label>
            <Select value={taskIcon} onValueChange={setTaskIcon}>
              <SelectTrigger id="task-icon">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {SelectedIcon && <SelectedIcon className="w-4 h-4" />}
                    <span>{taskIcon}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="h-[300px]">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {commonIconNames.map((iconName) => {
                    // Safely access the icon component
                    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<any>;
                    return (
                      <div
                        key={iconName}
                        className={cn(
                          "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-accent",
                          taskIcon === iconName && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => setTaskIcon(iconName)}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5 mb-1" />}
                        <span className="text-xs truncate max-w-full">{iconName}</span>
                      </div>
                    );
                  })}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTaskDialog;
