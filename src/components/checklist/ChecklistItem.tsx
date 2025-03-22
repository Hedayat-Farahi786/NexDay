
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChecklistItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isChecked: boolean;
  onToggle: (id: string, checked: boolean) => void;
}

const ChecklistItem = ({
  id,
  label,
  icon,
  isChecked,
  onToggle,
}: ChecklistItemProps) => {
  const [checked, setChecked] = useState(isChecked);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleToggle = () => {
    setAnimating(true);
    setChecked(!checked);
    onToggle(id, !checked);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setAnimating(false);
    }, 300);
  };

  return (
    <div className={cn(
      "checklist-item group animate-slide-in",
      checked ? "text-muted-foreground" : ""
    )}>
      <div
        className={cn(
          "custom-checkbox",
          checked ? "checked" : ""
        )}
        onClick={handleToggle}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={handleToggle}
          id={id}
        />
        {checked && (
          <Check
            className={cn(
              "stroke-[3]",
              animating ? "animate-checkbox-check" : ""
            )}
            style={{ strokeDasharray: "40", strokeDashoffset: animating ? "40" : "0" }}
          />
        )}
      </div>
      
      <div className="flex items-center gap-2.5 flex-1">
        <div className={cn(
          "text-primary transition-colors",
          checked ? "text-muted-foreground/70" : "text-primary"
        )}>
          {icon}
        </div>
        
        <label
          htmlFor={id}
          className={cn(
            "cursor-pointer text-sm font-medium transition-all",
            checked ? "line-through" : ""
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

export default ChecklistItem;
