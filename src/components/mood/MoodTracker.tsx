
import { useState } from "react";
import { Smile, Activity } from "lucide-react";
import CardContainer from "../cards/CardContainer";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  initialMood?: number;
  initialProductivity?: number;
  onUpdate: (moodValue: number, productivityValue: number) => void;
}

const MoodTracker = ({
  initialMood = 5,
  initialProductivity = 5,
  onUpdate
}: MoodTrackerProps) => {
  const [mood, setMood] = useState(initialMood);
  const [productivity, setProductivity] = useState(initialProductivity);

  const handleMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMood(value);
    onUpdate(value, productivity);
  };

  const handleProductivityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setProductivity(value);
    onUpdate(mood, value);
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
    <CardContainer title="Daily Metrics" className="col-span-full xl:col-span-1">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium">Mood</h4>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getMoodEmoji(mood)}</span>
              <span className="text-xl font-medium">{mood}/10</span>
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={handleMoodChange}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium">Productivity</h4>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getProductivityEmoji(productivity)}</span>
              <span className="text-xl font-medium">{productivity}/10</span>
            </div>
          </div>
          
          <input
            type="range"
            min="1"
            max="10"
            value={productivity}
            onChange={handleProductivityChange}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default MoodTracker;
