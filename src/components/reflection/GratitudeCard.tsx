
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import CardContainer from "../cards/CardContainer";

interface GratitudeCardProps {
  initialValues?: string[];
  onChange: (values: string[]) => void;
}

const GratitudeCard = ({ 
  initialValues = ["", "", ""],
  onChange 
}: GratitudeCardProps) => {
  const [gratitudes, setGratitudes] = useState<string[]>(initialValues);

  useEffect(() => {
    // If initialValues change, update the internal state
    if (JSON.stringify(initialValues) !== JSON.stringify(gratitudes)) {
      setGratitudes(initialValues);
    }
  }, [initialValues]);

  const handleChange = (index: number, value: string) => {
    const updatedGratitudes = [...gratitudes];
    updatedGratitudes[index] = value;
    setGratitudes(updatedGratitudes);
    onChange(updatedGratitudes);
  };

  return (
    <CardContainer title="Grateful For" titleIcon={<Heart className="w-5 h-5" />}>
      <div className="space-y-3">
        {gratitudes.map((gratitude, index) => (
          <div key={index} className="relative">
            <div className="absolute left-3 top-3 flex items-center justify-center rounded-full w-5 h-5 bg-primary text-primary-foreground text-xs font-medium">
              {index + 1}
            </div>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`I am grateful for...`}
              className="w-full px-10 py-2.5 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
        ))}
      </div>
    </CardContainer>
  );
};

export default GratitudeCard;
