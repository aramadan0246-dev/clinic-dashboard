import * as React from "react";
import { Plus, MapPin, ChevronRight } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { PrimaryBtn, EmptyRow, Avatar, Pill_, StatusDot } from "../shared";
import { IDoctor, IAppointment } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";
import { computeNextSlot } from "../../data/doctorsRepo";

export interface IDoctorsViewProps {
  doctors: IDoctor[];
  appts: IAppointment[];
  query: string;
  onToggle: (doctorId: number) => void;
  onSelect: (doctor: IDoctor) => void;
  onNew: () => void;
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

export function DoctorsView({ doctors, appts, query, onToggle, onSelect, onNew, permissions }: IDoctorsViewProps): JSX.Element {
  const filtered = doctors.filter((d) => matches(query, d.name, d.specialty));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {permissions.canAddDoctor && (
          <PrimaryBtn icon={Plus as React.ComponentType<{ size?: number }>} onClick={onNew}>
            Add doctor
          </PrimaryBtn>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.length === 0 && <EmptyRow text="No doctors match your search." />}
        {filtered.map((d) => (
          <div key={d.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <button onClick={() => onSelect(d)} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, width: "100%", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <Avatar initials={initialsFor(d.name)} color={colorFor(d.id)} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: 14.5, color: C.ink }}>{d.name}</div>
                <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{d.specialty}</div>
              </div>
              <ChevronRight size={16} color={C.inkFaint} />
            </button>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Pill_ bg={C.surface2} fg={C.inkSoft}><MapPin size={10} style={{ display: "inline", marginRight: 3, verticalAlign: -1 }} />Room {d.room}</Pill_>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 12, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>Next slot: <b style={{ color: C.ink }}>{computeNextSlot(d.id, appts)}</b></div>
              {permissions.canToggleDoctorStatus(d.id) ? (
                <button onClick={() => onToggle(d.id)} style={{ display: "flex", alignItems: "center", gap: 5, border: `1px solid ${C.border}`, background: C.bg, borderRadius: 999, padding: "4px 9px", cursor: "pointer" }}>
                  <StatusDot status={d.status} />
                  <span style={{ fontSize: 11.5, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "OffDuty" ? "Off duty" : d.status}</span>
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px" }}>
                  <StatusDot status={d.status} />
                  <span style={{ fontSize: 11.5, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "OffDuty" ? "Off duty" : d.status}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
