import * as React from "react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, EmptyRow, Avatar, StatusDot } from "../shared";
import { IDoctor, IAppointment, DoctorStatus } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";

export interface IDoctorAvailabilityPanelProps {
  doctors: IDoctor[];
  appts: IAppointment[];
  onToggle: (doctorId: number) => void;
  onSelect: (doctor: IDoctor) => void;
  query: string;
  permissions: IPermissions;
}

const ORDER: Record<DoctorStatus, number> = { Available: 0, Busy: 1, OffDuty: 2 };

function initialsFor(name: string): string {
  const clean = name.replace(/^Dr\.\s*/, "");
  const parts = clean.split(" ").filter(Boolean);
  return parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");
}

const AVATAR_COLORS = [C.teal, C.primary, C.amber, C.urgent, C.green];
function colorFor(id: number): string {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export function DoctorAvailabilityPanel({ doctors, onToggle, onSelect, query, permissions }: IDoctorAvailabilityPanelProps): JSX.Element {
  const filtered = doctors
    .filter((d) => matches(query, d.name, d.specialty))
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, height: "100%" }}>
      <SectionHeader title="Doctor availability" subtitle={`${doctors.filter((d) => d.status === "Available").length} available now`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {filtered.length === 0 && <EmptyRow text="No doctors match your search." />}
        {filtered.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", borderRadius: 10 }}>
            <button onClick={() => onSelect(d)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}>
              <Avatar initials={initialsFor(d.name)} color={colorFor(d.id)} size={34} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: C.inkSoft, fontFamily: "Inter, sans-serif" }}>{d.specialty}</div>
              </div>
            </button>
            {permissions.canToggleDoctorStatus(d.id) ? (
              <button onClick={() => onToggle(d.id)} style={{ display: "flex", alignItems: "center", gap: 5, border: "none", cursor: "pointer", background: "transparent", padding: "4px 8px", borderRadius: 999 }} title="Toggle status">
                <StatusDot status={d.status} />
                <span style={{ fontSize: 11, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "OffDuty" ? "Off duty" : d.status}</span>
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px" }}>
                <StatusDot status={d.status} />
                <span style={{ fontSize: 11, fontFamily: "Inter, sans-serif", color: C.inkSoft, textTransform: "capitalize" }}>{d.status === "OffDuty" ? "Off duty" : d.status}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
