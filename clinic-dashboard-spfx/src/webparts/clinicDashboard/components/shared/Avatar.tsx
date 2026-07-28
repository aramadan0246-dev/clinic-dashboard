import * as React from "react";

export interface IAvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export function Avatar({ initials, color, size = 36 }: IAvatarProps): JSX.Element {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "1A",
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Space Grotesk, sans-serif",
        fontWeight: 600,
        fontSize: size * 0.36,
        flexShrink: 0,
        border: `1.5px solid ${color}33`,
      }}
    >
      {initials}
    </div>
  );
}
