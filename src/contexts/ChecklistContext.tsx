
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define task types and categories
export type TaskCategory = "protocol" | "main" | "outreach";

export interface Task {
  id: string;
  label: string;
  category: TaskCategory;
  isCompleted: boolean;
  icon: string; // Lucide icon name
}

// Define the initial tasks for each category
export const initialTasks: Task[] = [
  // Protocol tasks
  { id: "pray", label: "Pray", category: "protocol", isCompleted: false, icon: "Heart" },
  { id: "water", label: "8 glass water", category: "protocol", isCompleted: false, icon: "Droplet" },
  { id: "no-weed", label: "No weed", category: "protocol", isCompleted: false, icon: "BadgeX" },
  { id: "read", label: "Read for 30mins", category: "protocol", isCompleted: false, icon: "BookOpen" },
  { id: "train", label: "1 hour training", category: "protocol", isCompleted: false, icon: "Dumbbell" },
  { id: "journal", label: "Journaling", category: "protocol", isCompleted: false, icon: "PenLine" },
  { id: "skincare", label: "Skincare", category: "protocol", isCompleted: false, icon: "Sparkles" },
  { id: "meditation", label: "20mins meditation", category: "protocol", isCompleted: false, icon: "Lotus" },
  
  // Main tasks
  { id: "deep-work", label: "Deep working for 2hrs", category: "main", isCompleted: false, icon: "BrainCircuit" },
  { id: "idea", label: "Work on idea & discuss", category: "main", isCompleted: false, icon: "Lightbulb" },
  { id: "edits", label: "Make 3/4 edits", category: "main", isCompleted: false, icon: "FileEdit" },
  
  // Outreach tasks
  { id: "podcast", label: "Listen podcast", category: "outreach", isCompleted: false, icon: "Headphones" },
  { id: "pushups", label: "500 push-ups", category: "outreach", isCompleted: false, icon: "Activity" },
  { id: "eliminate", label: "Eliminate", category: "outreach", isCompleted: false, icon: "X" },
];

export interface HistoryEntry {
  id: string;
  date: string;
  tasks: Task[];
  gratitudes: string[];
  lesson: string;
  mood: number;
  productivity: number;
}

interface ChecklistContextType {
  tasks: Task[];
  gratitudes: string[];
  lesson: string;
  mood: number;
  productivity: number;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  toggleTask: (id: string, checked: boolean) => void;
  updateGratitudes: (values: string[]) => void;
  updateLesson: (value: string) => void;
  updateMoodAndProductivity: (mood: number, productivity: number) => void;
  getTasks: (category: TaskCategory) => Task[];
  getProgress: (category: TaskCategory) => { completed: number; total: number };
  resetAllTasks: () => void;
  saveCurrentData: () => void;
  // New history-related functions
  getHistory: () => HistoryEntry[];
  deleteHistoryEntry: (id: string) => void;
  editHistoryEntry: (entry: HistoryEntry) => void;
  addCustomTask: (task: Omit<Task, "isCompleted">) => void;
  removeCustomTask: (id: string) => void;
  getAllTaskIds: () => string[];
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklist must be used within a ChecklistProvider");
  }
  return context;
};

interface ChecklistProviderProps {
  children: ReactNode;
}

export const ChecklistProvider = ({ children }: ChecklistProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("daily-checklist-tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [gratitudes, setGratitudes] = useState<string[]>(() => {
    const savedGratitudes = localStorage.getItem("daily-checklist-gratitudes");
    return savedGratitudes ? JSON.parse(savedGratitudes) : ["", "", ""];
  });
  
  const [lesson, setLesson] = useState<string>(() => {
    const savedLesson = localStorage.getItem("daily-checklist-lesson");
    return savedLesson || "";
  });
  
  const [mood, setMood] = useState<number>(() => {
    const savedMood = localStorage.getItem("daily-checklist-mood");
    return savedMood ? parseInt(savedMood) : 5;
  });
  
  const [productivity, setProductivity] = useState<number>(() => {
    const savedProductivity = localStorage.getItem("daily-checklist-productivity");
    return savedProductivity ? parseInt(savedProductivity) : 5;
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("daily-checklist-tasks", JSON.stringify(tasks));
    localStorage.setItem("daily-checklist-gratitudes", JSON.stringify(gratitudes));
    localStorage.setItem("daily-checklist-lesson", lesson);
    localStorage.setItem("daily-checklist-mood", mood.toString());
    localStorage.setItem("daily-checklist-productivity", productivity.toString());
  }, [tasks, gratitudes, lesson, mood, productivity]);

  const toggleTask = (id: string, checked: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isCompleted: checked } : task
      )
    );
  };

  const updateGratitudes = (values: string[]) => {
    setGratitudes(values);
  };

  const updateLesson = (value: string) => {
    setLesson(value);
  };

  const updateMoodAndProductivity = (moodValue: number, productivityValue: number) => {
    setMood(moodValue);
    setProductivity(productivityValue);
  };

  const getTasks = (category: TaskCategory) => {
    return tasks.filter((task) => task.category === category);
  };

  const getProgress = (category: TaskCategory) => {
    const categoryTasks = getTasks(category);
    const completed = categoryTasks.filter((task) => task.isCompleted).length;
    return {
      completed,
      total: categoryTasks.length,
    };
  };

  const resetAllTasks = () => {
    setTasks(initialTasks);
    setGratitudes(["", "", ""]);
    setLesson("");
    setMood(5);
    setProductivity(5);
    toast.success("All tasks have been reset");
  };

  const saveCurrentData = () => {
    const id = crypto.randomUUID();
    const date = new Date().toISOString();
    const historyItem: HistoryEntry = {
      id,
      date,
      tasks: [...tasks],
      gratitudes: [...gratitudes],
      lesson,
      mood,
      productivity,
    };

    // Get existing history or initialize an empty array
    const history = JSON.parse(localStorage.getItem("daily-checklist-history") || "[]");
    
    // Add new history item
    history.push(historyItem);
    
    // Save updated history
    localStorage.setItem("daily-checklist-history", JSON.stringify(history));
    
    toast.success("Today's progress has been saved");
  };

  // New history-related functions
  const getHistory = (): HistoryEntry[] => {
    return JSON.parse(localStorage.getItem("daily-checklist-history") || "[]");
  };

  const deleteHistoryEntry = (id: string) => {
    const history = getHistory();
    const filteredHistory = history.filter(entry => entry.id !== id);
    localStorage.setItem("daily-checklist-history", JSON.stringify(filteredHistory));
    toast.success("History entry deleted");
  };

  const editHistoryEntry = (updatedEntry: HistoryEntry) => {
    const history = getHistory();
    const updatedHistory = history.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    localStorage.setItem("daily-checklist-history", JSON.stringify(updatedHistory));
    toast.success("History entry updated");
  };

  const addCustomTask = (task: Omit<Task, "isCompleted">) => {
    const newTask: Task = { ...task, isCompleted: false };
    setTasks(prev => [...prev, newTask]);
    toast.success(`New task "${task.label}" added to ${task.category}`);
  };

  const removeCustomTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task removed");
  };

  const getAllTaskIds = () => {
    return tasks.map(task => task.id);
  };

  return (
    <ChecklistContext.Provider
      value={{
        tasks,
        gratitudes,
        lesson,
        mood,
        productivity,
        selectedDate,
        setSelectedDate,
        toggleTask,
        updateGratitudes,
        updateLesson,
        updateMoodAndProductivity,
        getTasks,
        getProgress,
        resetAllTasks,
        saveCurrentData,
        getHistory,
        deleteHistoryEntry,
        editHistoryEntry,
        addCustomTask,
        removeCustomTask,
        getAllTaskIds,
      }}
    >
      {children}
    </ChecklistContext.Provider>
  );
};
