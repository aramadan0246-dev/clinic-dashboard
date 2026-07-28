import * as React from "react";
import { C } from "./tokens";

export interface IFieldProps {
  label: string;
  children: React.ReactNode;
}

export function Field({ label, children }: IFieldProps): JSX.Element {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontFamily: "Inter, sans-serif" }}>
      <span style={{ fontSize: 11.5, color: C.inkSoft, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  border: `1px solid ${C.border}`,
  borderRadius: 9,
  padding: "9px 10px",
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  color: C.ink,
  background: C.surface,
  width: "100%",
};
