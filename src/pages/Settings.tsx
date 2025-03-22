import { useState } from "react";
import { useChecklist, TaskCategory } from "@/contexts/ChecklistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react";
import { Trash2, Plus, PenLine, Heart, Lightbulb, Share2, BookOpen, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Common icon names
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

// Helper to render Lucide icons safely
const IconDisplay = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.FC<any>;
  return IconComponent ? <IconComponent className={className} /> : null;
};

const Settings = () => {
  const { 
    tasks, 
    addCustomTask, 
    removeCustomTask, 
    getAllTaskIds
  } = useChecklist();
  
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskIcon, setNewTaskIcon] = useState("Circle");
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>("protocol");
  const [error, setError] = useState("");

  const protocolTasks = tasks.filter(task => task.category === "protocol");
  const mainTasks = tasks.filter(task => task.category === "main");
  const outreachTasks = tasks.filter(task => task.category === "outreach");

  const handleAddTask = () => {
    if (!newTaskName.trim()) {
      setError("Task name is required");
      return;
    }

    const taskId = newTaskName.toLowerCase().replace(/\s+/g, '-');
    
    if (getAllTaskIds().includes(taskId)) {
      setError("A task with this name already exists");
      return;
    }

    addCustomTask({
      id: taskId,
      label: newTaskName,
      category: selectedCategory,
      icon: newTaskIcon
    });

    setNewTaskName("");
    setNewTaskIcon("Circle");
    setError("");
    toast.success(`Added new task to ${selectedCategory}`);
  };

  const handleRemoveTask = (id: string) => {
    removeCustomTask(id);
    toast.success("Task removed");
  };

  return (
    <div className="container py-6 px-4 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize your checklist components and tasks</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reflection">Reflection</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Protocol Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-primary" />
                    <CardTitle>Protocol Tasks</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Manage your daily protocol tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-4">
                  {protocolTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <IconDisplay name={task.icon} className="h-4 w-4" />
                        <span>{task.label}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveTask(task.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>Main Tasks</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Manage your main focus tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-4">
                  {mainTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <IconDisplay name={task.icon} className="h-4 w-4" />
                        <span>{task.label}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveTask(task.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Outreach Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <CardTitle>Outreach Tasks</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  Manage your outreach tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-4">
                  {outreachTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <IconDisplay name={task.icon} className="h-4 w-4" />
                        <span>{task.label}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveTask(task.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add New Task Form */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a custom task for your checklist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="task-name">Task Name</Label>
                  <Input 
                    id="task-name" 
                    placeholder="Enter task name"
                    value={newTaskName}
                    onChange={(e) => {
                      setNewTaskName(e.target.value);
                      setError("");
                    }}
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="task-category">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => setSelectedCategory(value as TaskCategory)}
                  >
                    <SelectTrigger id="task-category">
                      <SelectValue placeholder="Category" />
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
                  <Select 
                    value={newTaskIcon} 
                    onValueChange={setNewTaskIcon}
                  >
                    <SelectTrigger id="task-icon">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <IconDisplay name={newTaskIcon} className="w-4 h-4" />
                          <span>{newTaskIcon}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="h-[200px]">
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {commonIconNames.map((iconName) => (
                          <div
                            key={iconName}
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-md cursor-pointer hover:bg-accent",
                              newTaskIcon === iconName && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => setNewTaskIcon(iconName)}
                          >
                            <IconDisplay name={iconName} className="w-5 h-5 mb-1" />
                            <span className="text-xs truncate max-w-full">{iconName}</span>
                          </div>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddTask}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reflection">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Gratitude Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <CardTitle>Gratitude Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure your gratitude entries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Number of Gratitude Entries</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue placeholder="Number of entries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Entry</SelectItem>
                        <SelectItem value="2">2 Entries</SelectItem>
                        <SelectItem value="3">3 Entries</SelectItem>
                        <SelectItem value="5">5 Entries</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Today's Lesson Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure your daily lesson section
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Section Title</Label>
                    <Input defaultValue="Today's Lesson" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Placeholder Text</Label>
                    <Input defaultValue="What did you learn today?" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Mood Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Metrics Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure your mood and productivity tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Scale Range</Label>
                    <Select defaultValue="1-10">
                      <SelectTrigger>
                        <SelectValue placeholder="Scale range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 Scale</SelectItem>
                        <SelectItem value="1-10">1-10 Scale</SelectItem>
                        <SelectItem value="1-100">1-100 Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Show Mood Tracker</Label>
                    <Select defaultValue="true">
                      <SelectTrigger>
                        <SelectValue placeholder="Show tracker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Show Productivity Tracker</Label>
                    <Select defaultValue="true">
                      <SelectTrigger>
                        <SelectValue placeholder="Show tracker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>Chart Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure how charts are displayed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Default Chart Type</Label>
                    <Select defaultValue="line">
                      <SelectTrigger>
                        <SelectValue placeholder="Chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Default Time Range</Label>
                    <Select defaultValue="week">
                      <SelectTrigger>
                        <SelectValue placeholder="Time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>Configure general app settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Auto-Save Interval</Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue placeholder="Save interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Off (Manual Save)</SelectItem>
                      <SelectItem value="1">Every 1 Minute</SelectItem>
                      <SelectItem value="5">Every 5 Minutes</SelectItem>
                      <SelectItem value="15">Every 15 Minutes</SelectItem>
                      <SelectItem value="30">Every 30 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Auto-Reset Time</Label>
                  <Select defaultValue="midnight">
                    <SelectTrigger>
                      <SelectValue placeholder="Reset time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="midnight">Midnight</SelectItem>
                      <SelectItem value="3am">3:00 AM</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Default View</Label>
                  <Select defaultValue="today">
                    <SelectTrigger>
                      <SelectValue placeholder="Default view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today's Tasks</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Export Format</Label>
                  <Select defaultValue="json">
                    <SelectTrigger>
                      <SelectValue placeholder="Export format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

