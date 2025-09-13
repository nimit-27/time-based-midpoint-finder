import React from "react";

interface TravelModeSelectorProps {
  value: string;
  onChange: (mode: string) => void;
  className?: string;
}

const TravelModeSelector: React.FC<TravelModeSelectorProps> = ({ value, onChange, className }) => {
  return (
    <select className={className} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="driving-car">Driving</option>
      <option value="cycling-regular">Cycling</option>
      <option value="foot-walking">Walking</option>
    </select>
  );
};

export default TravelModeSelector;
