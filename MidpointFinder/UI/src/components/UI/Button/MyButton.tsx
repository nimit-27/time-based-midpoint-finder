import React, { useState } from "react";
import "./MyButton.scss";

interface MyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const MyButton: React.FC<MyButtonProps> = ({
  label,
  onClick,
  children,
  className,
  ...props
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseDown = () => {
    setIsClicked(true);
  };

  const handleMouseLeave = () => {
    setIsClicked(false); // Remove the focus style when the mouse leaves
  };
  return (
    <button
      onClick={onClick}
      className={`my-button ${className ?? ""}`}
      data-clicked={isClicked}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {label}
      {children}
    </button>
  );
};

export default MyButton;
