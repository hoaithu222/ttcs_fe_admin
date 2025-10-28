import React from "react";

interface MagnifyingGlassIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const MagnifyingGlassIcon: React.FC<MagnifyingGlassIconProps> = ({
  color = "currentColor",
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export default MagnifyingGlassIcon;
