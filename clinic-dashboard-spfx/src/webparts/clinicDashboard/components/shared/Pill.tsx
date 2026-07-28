import * as React from "react";

export interface IPillProps {
  children: React.ReactNode;
  bg: string;
  fg: string;
  style?: React.CSSProperties;
}

export function Pill_({ children, bg, fg, style }: IPillProps): JSX.Element {
  return (
    <span
      style={{
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        fontFamily: "Inter, sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
