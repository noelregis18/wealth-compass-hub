
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SliderInputProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  setValue,
  min,
  max,
  step,
  unit = "",
  formatValue = (val) => val.toString(),
}) => {
  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue)) {
      setValue(Math.min(Math.max(newValue, min), max));
    }
  };

  return (
    <div className="space-y-4 my-4">
      <div className="flex justify-between items-center">
        <Label htmlFor={label.replace(/\s+/g, "-").toLowerCase()}>
          {label}
        </Label>
        <div className="w-24">
          <Input
            id={label.replace(/\s+/g, "-").toLowerCase()}
            type="text"
            value={unit ? `${formatValue(value)} ${unit}` : formatValue(value)}
            onChange={handleInputChange}
            className="text-right"
          />
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="my-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{unit ? `${formatValue(min)} ${unit}` : formatValue(min)}</span>
        <span>{unit ? `${formatValue(max)} ${unit}` : formatValue(max)}</span>
      </div>
    </div>
  );
};

export default SliderInput;
