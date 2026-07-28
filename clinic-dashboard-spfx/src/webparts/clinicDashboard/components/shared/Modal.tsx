import * as React from "react";
import { X } from "lucide-react";
import { C } from "./tokens";

export interface IModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ title, onClose, children, width = 440 }: IModalProps): JSX.Element {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div
        style={{
          position: "relative",
          width: `min(${width}px, 100%)`,
          background: C.surface,
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 20px 50px #0F272340",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 17, margin: 0, color: C.ink }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ border: "none", background: C.surface2, borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={15} color={C.inkSoft} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
