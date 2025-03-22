
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardContainerProps {
  children: ReactNode;
  className?: string;
  title: string;
  progress?: {
    completed: number;
    total: number;
  };
  titleIcon?: ReactNode;
}

const CardContainer = ({
  children,
  className,
  title,
  progress,
  titleIcon
}: CardContainerProps) => {
  const progressPercentage = progress 
    ? Math.round((progress.completed / progress.total) * 100) 
    : null;

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-5",
        "shadow-sm transition-all hover:shadow-md",
        "animate-scale-in",
        className
      )}
    >
      <div className="card-header">
        <div className="flex items-center gap-2">
          {titleIcon && (
            <div className="text-primary">{titleIcon}</div>
          )}
          <h3 className="card-title">{title}</h3>
        </div>
        {progress && (
          <div className="card-progress">
            <span className="font-medium">{progress.completed}/{progress.total}</span>
            {progressPercentage !== null && (
              <span className="ml-2 text-xs">({progressPercentage}%)</span>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default CardContainer;
