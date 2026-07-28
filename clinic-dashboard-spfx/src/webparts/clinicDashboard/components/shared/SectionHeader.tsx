import * as React from "react";
import { C } from "./tokens";

export interface ISectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, action }: ISectionHeaderProps): JSX.Element {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 17, color: C.ink, margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2, fontFamily: "Inter, sans-serif" }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}
