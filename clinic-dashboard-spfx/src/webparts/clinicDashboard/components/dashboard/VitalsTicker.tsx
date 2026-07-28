import * as React from "react";
import { HeartPulse } from "lucide-react";
import { C } from "../shared/tokens";

export interface IVitalsTickerProps {
  urgentCount: number;
  availableCount: number;
  totalDoctors: number;
}

export function VitalsTicker({ urgentCount, availableCount, totalDoctors }: IVitalsTickerProps): JSX.Element {
  const speed = Math.max(2.6, 6 - urgentCount * 0.5);
  return (
    <div style={{ background: C.primary, borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16, overflow: "hidden", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, zIndex: 1 }}>
        <HeartPulse size={17} color="#fff" />
        <span style={{ color: "#fff", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 13.5 }}>Ward pulse</span>
      </div>
      <div style={{ flex: 1, height: 34, position: "relative" }}>
        <svg viewBox="0 0 600 40" preserveAspectRatio="none" style={{ width: "200%", height: "100%", position: "absolute", left: 0, animation: `ekgScroll ${speed}s linear infinite` }}>
          <polyline
            points="0,20 40,20 55,20 62,6 68,34 74,20 90,20 130,20 145,20 152,6 158,34 164,20 180,20 220,20 235,20 242,6 248,34 254,20 270,20 310,20 325,20 332,6 338,34 344,20 360,20 400,20 415,20 422,6 428,34 434,20 450,20 490,20 505,20 512,6 518,34 524,20 540,20 580,20 595,20 602,6 608,34 614,20 630,20"
            fill="none" stroke="#8FD9C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ display: "flex", gap: 18, flexShrink: 0, zIndex: 1 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15 }}>{urgentCount}</div>
          <div style={{ color: "#ffffffa0", fontSize: 10.5, fontFamily: "Inter, sans-serif" }}>urgent now</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#fff", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15 }}>{availableCount}/{totalDoctors}</div>
          <div style={{ color: "#ffffffa0", fontSize: 10.5, fontFamily: "Inter, sans-serif" }}>doctors free</div>
        </div>
      </div>
      <style>{`@keyframes ekgScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
