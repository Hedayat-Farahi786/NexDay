
import { useNavigate } from "react-router-dom";
import { useChecklist } from "@/contexts/ChecklistContext";
import { Save, RefreshCw, Download, History } from "lucide-react";
import { toast } from "sonner";

const ActionButtons = () => {
  const { resetAllTasks, saveCurrentData } = useChecklist();
  const navigate = useNavigate();

  const handleExport = () => {
    try {
      const data = {
        tasks: JSON.parse(localStorage.getItem("daily-checklist-tasks") || "[]"),
        gratitudes: JSON.parse(localStorage.getItem("daily-checklist-gratitudes") || "[]"),
        lesson: localStorage.getItem("daily-checklist-lesson"),
        mood: localStorage.getItem("daily-checklist-mood"),
        productivity: localStorage.getItem("daily-checklist-productivity"),
        history: JSON.parse(localStorage.getItem("daily-checklist-history") || "[]")
      };
      
      // Create a Blob with the data
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      
      // Set the filename
      const date = new Date().toISOString().split("T")[0];
      link.download = `daily-checklist-${date}.json`;
      
      // Append the link to the body
      document.body.appendChild(link);
      
      // Programmatically click the link to trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const handleNavigateToHistory = () => {
    navigate("/history");
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4">
      <button
        onClick={saveCurrentData}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="Save data"
      >
        <Save className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNavigateToHistory}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="View history"
      >
        <History className="w-5 h-5" />
      </button>
      
      <button
        onClick={resetAllTasks}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="Reset all tasks"
      >
        <RefreshCw className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleExport}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
        aria-label="Export data"
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ActionButtons;
