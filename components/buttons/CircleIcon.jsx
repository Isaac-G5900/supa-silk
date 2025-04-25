"use client";

import React from "react";

function CircleIcon({
  icon, // Pass the Lucide React SVG component as a React element
  color = "#e5e7eb",
  hoverColor = "#91a5c2",
  size = 60,
  iconSize = 30,
  onClick,
}) {
  return (
    <div
      className="flex items-center justify-center rounded-full transition-colors duration-100 cursor-pointer"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = color)}
      onClick={onClick}
    >
      <div
        style={{
          width: iconSize,
          height: iconSize,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default CircleIcon;
