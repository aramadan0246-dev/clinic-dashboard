import * as React from "react";
import { AlertTriangle, LogOut, MoreHorizontal } from "lucide-react";
import { C, matches } from "../shared/tokens";
import { SectionHeader, Pill_, EmptyRow, IconBtn } from "../shared";
import { IPatient, IDoctor } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";
import { UrgentCasesPanel } from "./UrgentCasesPanel";

export interface IPatientsViewProps {
  urgentCases: IPatient[];
  roster: IPatient[];
  doctors: IDoctor[];
  query: string;
  onSelectPatient: (p: IPatient) => void;
  onNewPatient: () => void;
  onAdmit: (p: IPatient) => void;
  onDischargeRoster: (id: number) => void;
  permissions: IPermissions;
}

export function PatientsView({
  urgentCases,
  roster,
  doctors,
  query,
  onSelectPatient,
  onNewPatient,
  onAdmit,
  onDischargeRoster,
  permissions,
}: IPatientsViewProps): JSX.Element {
  const filteredRoster = roster.filter((r) =>
    matches(query, r.name, r.mrn, r.assignedDoctorName, r.status)
  );
  const [menuFor, setMenuFor] = React.useState<number | undefined>(undefined);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <UrgentCasesPanel
        cases={urgentCases}
        onSelect={onSelectPatient}
        query={query}
        onNew={permissions.canAddPatient ? onNewPatient : undefined}
      />
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <SectionHeader title="Patient roster" subtitle={`${filteredRoster.length} patients on record today`} />
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: `1px solid ${C.border}` }}>
                {["MRN", "Patient", "Age", "Doctor", "Status", "Last visit", ""].map((h) => (
                  <th key={h} style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: C.inkFaint, fontWeight: 600, padding: "0 10px 10px", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRoster.length === 0 && (
                <tr><td colSpan={7}><EmptyRow text="No patients match your search." /></td></tr>
              )}
              {filteredRoster.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.borderSoft}` }}>
                  <td style={{ padding: "10px", fontFamily: "IBM Plex Mono, monospace", fontSize: 12, color: C.inkSoft }}>{r.mrn}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: C.ink }}>{r.name}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.inkSoft }}>{r.age}</td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 13, color: C.inkSoft }}>{r.assignedDoctorName}</td>
                  <td style={{ padding: "10px" }}>
                    <Pill_ bg={r.status === "Discharged" ? C.surface2 : C.tealSoft} fg={r.status === "Discharged" ? C.inkSoft : C.teal}>{r.status}</Pill_>
                  </td>
                  <td style={{ padding: "10px", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.inkFaint }}>{r.lastVisit}</td>
                  <td style={{ padding: "10px", position: "relative" }}>
                    <IconBtn
                      icon={MoreHorizontal as React.ComponentType<{ size?: number }>}
                      title="Actions"
                      onClick={() => setMenuFor(menuFor === r.id ? undefined : r.id)}
                    />
                    {menuFor === r.id && (
                      <div style={{ position: "absolute", right: 10, top: 40, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 10px 26px #0F272326", zIndex: 5, minWidth: 170, overflow: "hidden" }}>
                        {r.status !== "Discharged" && permissions.canAdmitAsUrgent && (
                          <button onClick={() => { onAdmit(r); setMenuFor(undefined); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, textAlign: "left" }}>
                            <AlertTriangle size={13} color={C.urgent} /> Admit as urgent
                          </button>
                        )}
                        {r.status !== "Discharged" && permissions.canDischargePatient && (
                          <button onClick={() => { onDischargeRoster(r.id); setMenuFor(undefined); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.ink, textAlign: "left" }}>
                            <LogOut size={13} color={C.inkSoft} /> Discharge
                          </button>
                        )}
                        {(r.status === "Discharged" || (!permissions.canAdmitAsUrgent && !permissions.canDischargePatient)) && (
                          <div style={{ padding: "9px 12px", fontSize: 12, color: C.inkFaint, fontFamily: "Inter, sans-serif" }}>No actions available</div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
