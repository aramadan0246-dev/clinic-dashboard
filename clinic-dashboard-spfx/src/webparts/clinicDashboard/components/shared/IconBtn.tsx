import * as React from "react";
import { C } from "./tokens";

export interface IIconBtnProps {
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  title?: string;
  tone?: "danger";
}

export function IconBtn({ icon: Icon, onClick, title, tone }: IIconBtnProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${C.border}`,
        background: C.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: tone === "danger" ? C.urgent : C.inkSoft,
        flexShrink: 0,
      }}
    >
      <Icon size={14} />
    </button>
  );
}
