import * as React from "react";
import { X, MapPin, PhoneCall, MessageSquare, Trash2 } from "lucide-react";
import { C } from "../shared/tokens";
import { Avatar, Pill_, EmptyRow, StatusDot } from "../shared";
import { IDoctor, IAppointment } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";
import { computeNextSlot } from "../../data/doctorsRepo";

export interface IDoctorDrawerProps {
  doctor: IDoctor | undefined;
  onClose: () => void;
  onToggle: (doctorId: number) => void;
  appts: IAppointment[];
  onRemove: (doctorId: number) => void;
  permissions: IPermissions;
}

function initialsFor(name: string): string {
  const clean = name.replace(/^Dr\.\s*/, "");
  const parts = clean.split(" ").filter(Boolean);
  return parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");
}

const AVATAR_COLORS = [C.teal, C.primary, C.amber, C.urgent, C.green];
function colorFor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatApptTime(apptDateTime: string): string {
  return new Date(apptDateTime).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function DoctorDrawer({ doctor, onClose, onToggle, appts, onRemove, permissions }: IDoctorDrawerProps): JSX.Element | null {
  if (!doctor) return null;
  const schedule = appts.filter((a) => a.doctorName === doctor.name);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div style={{ position: "relative", width: "min(420px, 92vw)", background: C.surface, height: "100%", boxShadow: "-8px 0 30px #0F272322", padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar initials={initialsFor(doctor.name)} color={colorFor(doctor.id)} size={46} />
            <div>
              <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, margin: 0 }}>{doctor.name}</h2>
              <div style={{ fontSize: 12.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{doctor.specialty}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.surface2, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          <Pill_ bg={C.surface2} fg={C.inkSoft}><MapPin size={10} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />Room {doctor.room}</Pill_>
          <Pill_ bg={C.surface2} fg={C.inkSoft}>{schedule.length} appts today</Pill_>
          <Pill_ bg={C.tealSoft} fg={C.teal}>Next: {computeNextSlot(doctor.id, appts)}</Pill_>
        </div>

        {permissions.canToggleDoctorStatus(doctor.id) ? (
          <button onClick={() => onToggle(doctor.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 10, padding: "10px 0", cursor: "pointer", marginBottom: 12 }}>
            <StatusDot status={doctor.status} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink, textTransform: "capitalize" }}>
              {doctor.status === "OffDuty" ? "Off duty — set as available" : `Currently ${doctor.status} — cycle status`}
            </span>
          </button>
        ) : (
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 10, padding: "10px 0", marginBottom: 12 }}>
            <StatusDot status={doctor.status} />
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink, textTransform: "capitalize" }}>
              {doctor.status === "OffDuty" ? "Off duty" : `Currently ${doctor.status}`}
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "10px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: C.inkSoft }}>
            <PhoneCall size={13} /> Call
          </button>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "10px 0", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600, color: C.inkSoft }}>
            <MessageSquare size={13} /> Message
          </button>
        </div>

        <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 8, textTransform: "uppercase" }}>Today's schedule</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {schedule.length === 0 && <EmptyRow text="No appointments scheduled." />}
          {schedule.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", border: `1px solid ${C.borderSoft}`, borderRadius: 10 }}>
              <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11.5, color: C.inkSoft, width: 58 }}>{formatApptTime(a.apptDateTime)}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, flex: 1 }}>{a.patientName}</span>
              <StatusDot status={a.status} />
            </div>
          ))}
        </div>

        {permissions.canRemoveDoctor && (
          <button onClick={() => { onRemove(doctor.id); onClose(); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "transparent", color: C.urgent, border: `1px solid ${C.urgentSoft}`, borderRadius: 10, padding: "10px 0", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Trash2 size={14} /> Remove from staff list
          </button>
        )}
      </div>
    </div>
  );
}
