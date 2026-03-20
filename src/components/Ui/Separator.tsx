import React, { memo } from "react";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  thickness?: string;
  color?: string;
}

const Separator = memo(({
  orientation = "horizontal",
  className = "",
  thickness = "1px",
  color = "bg-zinc-800",
}: SeparatorProps) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      role="separator"
      className={`${color} ${className} opacity-40`}
      style={{
        width: isHorizontal ? "100%" : thickness,
        height: isHorizontal ? thickness : "100%",
        display: isHorizontal ? "block" : "inline-block",
      }}
    />
  );
});

Separator.displayName = "Separator";

export default Separator;
