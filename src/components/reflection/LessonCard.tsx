
import { useState } from "react";
import { BookOpen } from "lucide-react";
import CardContainer from "../cards/CardContainer";

interface LessonCardProps {
  initialValue?: string;
  onChange: (value: string) => void;
}

const LessonCard = ({ 
  initialValue = "",
  onChange 
}: LessonCardProps) => {
  const [lesson, setLesson] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLesson(e.target.value);
    onChange(e.target.value);
  };

  return (
    <CardContainer title="Today's Lesson" titleIcon={<BookOpen className="w-5 h-5" />}>
      <textarea
        value={lesson}
        onChange={handleChange}
        placeholder="What did you learn today?"
        className="w-full h-[130px] p-3 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
      />
      <div className="mt-2 text-xs text-right text-muted-foreground">
        {lesson.length} characters
      </div>
    </CardContainer>
  );
};

export default LessonCard;
