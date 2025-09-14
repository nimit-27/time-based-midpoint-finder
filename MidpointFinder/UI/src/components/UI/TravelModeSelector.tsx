import React from "react";
import CustomIconButton from "./IconButton/CustomIconButton";
import "./TravelModeSelector.scss";

interface TravelModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
  className?: string;
}

const modes = [
  { value: "driving-car", icon: "directionsCar" },
  { value: "cycling-regular", icon: "directionsBike" },
  { value: "foot-walking", icon: "directionsWalk" },
];

const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({ value, onChange, className }) => {
  return (
    <div className={`travel-mode-selector ${className ?? ""}`}>
      {modes.map((mode) => (
        <CustomIconButton
          key={mode.value}
          icon={mode.icon}
          color={value === mode.value ? "primary" : "default"}
          onClick={() => onChange(mode.value)}
        />
      ))}
    </div>
  );
};

export default TravelModeSelector;

