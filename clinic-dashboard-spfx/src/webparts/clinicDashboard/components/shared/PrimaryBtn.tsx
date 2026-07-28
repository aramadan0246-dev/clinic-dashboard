import * as React from "react";
import { C } from "./tokens";

export interface IPrimaryBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ComponentType<{ size?: number }>;
}

export function PrimaryBtn({ children, onClick, icon: Icon }: IPrimaryBtnProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        background: C.primary,
        color: "#fff",
        border: "none",
        borderRadius: 10,
        padding: "9px 14px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
