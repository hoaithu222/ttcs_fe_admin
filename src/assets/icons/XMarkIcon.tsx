import React from "react";

interface XMarkIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const XMarkIcon: React.FC<XMarkIconProps> = ({ color = "currentColor", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default XMarkIcon;
