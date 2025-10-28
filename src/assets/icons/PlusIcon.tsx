import React from "react";

interface PlusIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const PlusIcon: React.FC<PlusIconProps> = ({ color = "currentColor", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default PlusIcon;
