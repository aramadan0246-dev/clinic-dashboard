import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { C } from "./tokens";
import { IToast } from "../../context/ClinicDataProvider";

export interface IToastStackProps {
  toasts: IToast[];
}

export function ToastStack({ toasts }: IToastStackProps): JSX.Element {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.tone === "error" ? C.urgent : C.primary,
            color: "#fff",
            padding: "11px 16px",
            borderRadius: 10,
            fontFamily: "Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 24px #0F272333",
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 200,
            animation: "toastIn .18s ease",
          }}
        >
          <CheckCircle2 size={15} />
          {t.msg}
        </div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:none; } }`}</style>
    </div>
  );
}
