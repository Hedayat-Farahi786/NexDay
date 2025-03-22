
import { Suspense, lazy, useMemo } from "react";
import CardContainer from "../cards/CardContainer";
import { useChecklist, TaskCategory } from "@/contexts/ChecklistContext";
import ChecklistItem from "../checklist/ChecklistItem";
import * as LucideIcons from "lucide-react";

// Dynamically import Lucide icons
const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (LucideIcons as any)[name];
  return IconComponent ? <IconComponent {...props} /> : null;
};

interface TaskListProps {
  category: TaskCategory;
  title: string;
  titleIcon: React.ReactNode;
}

const TaskList = ({ category, title, titleIcon }: TaskListProps) => {
  const { getTasks, getProgress, toggleTask } = useChecklist();
  
  const tasks = getTasks(category);
  const progress = getProgress(category);

  return (
    <CardContainer 
      title={title} 
      progress={progress}
      titleIcon={titleIcon}
    >
      <div className="space-y-1">
        {tasks.map((task) => (
          <ChecklistItem
            key={task.id}
            id={task.id}
            label={task.label}
            icon={<Icon name={task.icon} className="w-4 h-4" />}
            isChecked={task.isCompleted}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </CardContainer>
  );
};

export default TaskList;
