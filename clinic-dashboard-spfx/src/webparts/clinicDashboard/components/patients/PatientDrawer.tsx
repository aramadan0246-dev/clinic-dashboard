import * as React from "react";
import { X, LogOut } from "lucide-react";
import { C } from "../shared/tokens";
import { Pill_, Field, inputStyle } from "../shared";
import { IPatient, IDoctor } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";

export interface IPatientDrawerProps {
  patient: IPatient | undefined;
  onClose: () => void;
  doctors: IDoctor[];
  onAssignDoctor: (patientId: number, doctorId: number) => void;
  onDischarge: (patientId: number) => void;
  permissions: IPermissions;
}

const SEVERITY_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  UrgentCritical: { bg: C.urgentSoft, fg: C.urgent, label: "Critical" },
  UrgentHigh: { bg: C.amberSoft, fg: C.amber, label: "High" },
  UrgentModerate: { bg: C.tealSoft, fg: C.teal, label: "Moderate" },
  UrgentLow: { bg: C.surface2, fg: C.inkSoft, label: "Low" },
};

export function PatientDrawer({ patient, onClose, doctors, onAssignDoctor, onDischarge, permissions }: IPatientDrawerProps): JSX.Element | null {
  if (!patient) return null;
  const sev = SEVERITY_STYLE[patient.status];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "#0F272380" }} />
      <div style={{ position: "relative", width: "min(420px, 92vw)", background: C.surface, height: "100%", boxShadow: "-8px 0 30px #0F272322", padding: 24, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            {sev && (
              <Pill_ bg={sev.bg} fg={sev.fg} style={{ marginBottom: 8, display: "inline-block" }}>{sev.label} priority</Pill_>
            )}
            <h2 style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 20, fontWeight: 700, color: C.ink, margin: 0 }}>{patient.name}</h2>
            <div style={{ fontSize: 12.5, color: C.inkSoft, fontFamily: "IBM Plex Mono, monospace", marginTop: 3 }}>{patient.mrn} · Age {patient.age}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: C.surface2, borderRadius: 999, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={16} color={C.inkSoft} />
          </button>
        </div>

        <div style={{ background: C.bg, border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Reason for visit</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: C.ink }}>{patient.reasonForVisit}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { label: "Heart rate", value: `${patient.heartRate ?? "—"}` },
            { label: "Blood pressure", value: patient.bloodPressure },
            { label: "SpO₂", value: patient.spo2 },
          ].map((v) => (
            <div key={v.label} style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontFamily: "IBM Plex Mono, monospace", fontWeight: 600, fontSize: 15, color: C.primary }}>{v.value}</div>
              <div style={{ fontSize: 10, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginTop: 2 }}>{v.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11.5, color: C.inkFaint, fontFamily: "Inter, sans-serif", marginBottom: 6, textTransform: "uppercase" }}>Clinical notes</div>
          <div style={{ fontSize: 13, color: C.inkSoft, fontFamily: "Inter, sans-serif", lineHeight: 1.55 }}>{patient.clinicalNotes}</div>
        </div>

        {permissions.canReassignPhysician(patient.assignedDoctorId, patient.assignedDoctorName) && (
          <Field label="Assigned physician">
            <select
              value={patient.assignedDoctorId ?? ""}
              onChange={(e) => onAssignDoctor(patient.id, Number(e.target.value))}
              style={inputStyle}
            >
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>)}
            </select>
          </Field>
        )}

        {permissions.canDischargePatient && (
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => { onDischarge(patient.id); onClose(); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <LogOut size={14} /> Discharge patient
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
