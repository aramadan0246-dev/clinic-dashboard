import * as React from "react";
import { Plus, Ban, Trash2 } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, PrimaryBtn, EmptyRow, StatusDot, IconBtn } from "../shared";
import { IAppointment, AppointmentStatus } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";

export interface IAppointmentsPanelProps {
  appts: IAppointment[];
  onCycleStatus: (id: number) => void;
  onCancel: (id: number) => void;
  onRemove: (id: number) => void;
  query: string;
  onNew?: () => void;
  permissions: IPermissions;
}

const NEXT_LABEL: Record<AppointmentStatus, string> = {
  Upcoming: "Upcoming",
  InProgress: "In progress",
  Completed: "Completed",
  Cancelled: "Cancelled",
};

export function AppointmentsPanel({ appts, onCycleStatus, onCancel, onRemove, query, onNew, permissions }: IAppointmentsPanelProps): JSX.Element {
  const filtered = appts.filter((a) => matches(query, a.patientName, a.doctorName, a.visitType));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Today's appointments"
        subtitle={`${filtered.length} scheduled · click status to update`}
        action={onNew && <PrimaryBtn icon={Plus as React.ComponentType<{ size?: number }>} onClick={onNew}>New appointment</PrimaryBtn>}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filtered.length === 0 && <EmptyRow text="No appointments match your search." />}
        {filtered.map((a, i) => {
          const canCycle = permissions.canProgressAppointmentStatus && a.status !== "Cancelled";
          return (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 4px", borderTop: i === 0 ? "none" : `1px solid ${C.borderSoft}`, flexWrap: "wrap" }}>
              <div style={{ width: 62, flexShrink: 0, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.inkSoft }}>
                {new Date(a.apptDateTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </div>
              <div style={{ width: 3, height: 32, borderRadius: 3, background: a.status === "Cancelled" ? C.inkFaint : C.teal, flexShrink: 0, opacity: a.status === "Cancelled" ? 0.4 : 1 }} />
              <div style={{ flex: 1, minWidth: 120 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: a.status === "Cancelled" ? C.inkFaint : C.ink, textDecoration: a.status === "Cancelled" ? "line-through" : "none" }}>{a.patientName}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{a.visitType} · {a.doctorName} · Rm {a.room}</div>
              </div>
              <button
                onClick={() => canCycle && onCycleStatus(a.id)}
                disabled={!canCycle}
                style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 999, padding: "5px 10px", cursor: canCycle ? "pointer" : "default", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: C.inkSoft, flexShrink: 0 }}
              >
                <StatusDot status={a.status} />{NEXT_LABEL[a.status]}
              </button>
              {a.status !== "Cancelled" ? (
                permissions.canCancelAppointment && (
                  <IconBtn icon={Ban as React.ComponentType<{ size?: number }>} title="Cancel appointment" tone="danger" onClick={() => onCancel(a.id)} />
                )
              ) : (
                <IconBtn icon={Trash2 as React.ComponentType<{ size?: number }>} title="Remove" tone="danger" onClick={() => onRemove(a.id)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
