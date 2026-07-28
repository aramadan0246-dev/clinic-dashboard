import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { C } from "./tokens";

export interface IStatCardProps {
  label: string;
  value: string | number;
  delta?: string | number;
  deltaDir?: "up" | "down";
  icon: React.ComponentType<{ size?: number; color?: string }>;
  tint: string;
}

export function StatCard({ label, value, delta, deltaDir, icon: Icon, tint }: IStatCardProps): JSX.Element {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: tint + "17", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} color={tint} />
        </div>
        {delta != null && (
          <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: deltaDir === "up" ? C.green : C.urgent, fontFamily: "Inter, sans-serif" }}>
            {deltaDir === "up" ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 26, color: C.ink, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{label}</div>
    </div>
  );
}
