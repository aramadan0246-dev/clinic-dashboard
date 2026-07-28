import * as React from "react";
import { Plus, Clock, ChevronRight } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, Pill_, PrimaryBtn, EmptyRow } from "../shared";
import { IPatient } from "../../data/models";
import { computeWaitLabel } from "../../data/patientsRepo";

export interface IUrgentCasesPanelProps {
  cases: IPatient[];
  onSelect: (p: IPatient) => void;
  query: string;
  onNew?: () => void;
}

const SEVERITY_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  UrgentCritical: { bg: C.urgentSoft, fg: C.urgent, label: "Critical" },
  UrgentHigh: { bg: C.amberSoft, fg: C.amber, label: "High" },
  UrgentModerate: { bg: C.tealSoft, fg: C.teal, label: "Moderate" },
  UrgentLow: { bg: C.surface2, fg: C.inkSoft, label: "Low" },
};

export function UrgentCasesPanel({ cases, onSelect, query, onNew }: IUrgentCasesPanelProps): JSX.Element {
  const filtered = cases.filter((p) =>
    matches(query, p.name, p.mrn, p.reasonForVisit, p.assignedDoctorName)
  );
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <SectionHeader
        title="Urgent cases"
        subtitle={`${filtered.length} patients flagged for immediate attention`}
        action={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Pill_ bg={C.urgentSoft} fg={C.urgent}>Live</Pill_>
            {onNew && (
              <PrimaryBtn icon={Plus as React.ComponentType<{ size?: number }>} onClick={onNew}>
                Add patient
              </PrimaryBtn>
            )}
          </div>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && <EmptyRow text="No urgent cases match your search." />}
        {filtered.map((p) => {
          const sev = SEVERITY_STYLE[p.status];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: `1px solid ${C.borderSoft}`, borderRadius: 12, background: C.bg, cursor: "pointer", textAlign: "left", width: "100%" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.surface2)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.bg)}
            >
              <div style={{ width: 4, alignSelf: "stretch", borderRadius: 4, background: sev.fg, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: C.ink }}>{p.name}</span>
                  <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: C.inkFaint }}>{p.mrn}</span>
                  <Pill_ bg={sev.bg} fg={sev.fg}>{sev.label}</Pill_>
                </div>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3, fontFamily: "Inter, sans-serif" }}>{p.reasonForVisit}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif" }}>{p.assignedDoctorName.replace("Dr. ", "")}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", color: C.urgent, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, fontWeight: 600, marginTop: 2 }}>
                  <Clock size={11} /> {computeWaitLabel(p.flaggedAt)}
                </div>
              </div>
              <ChevronRight size={16} color={C.inkFaint} style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
