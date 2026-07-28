import * as React from "react";
import { C } from "../shared/tokens";
import { Field, PrimaryBtn, inputStyle } from "../shared";
import { IDoctor, PatientStatus } from "../../data/models";

export interface IAddPatientFormProps {
  doctors: IDoctor[];
  onSubmit: (data: {
    name: string;
    age: number;
    reasonForVisit: string;
    status: PatientStatus;
    doctorId: number | null;
  }) => void;
  onClose: () => void;
}

type UrgentSeverity = "UrgentCritical" | "UrgentHigh" | "UrgentModerate" | "UrgentLow";

export function AddPatientForm({ doctors, onSubmit, onClose }: IAddPatientFormProps): JSX.Element {
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [severity, setSeverity] = React.useState<UrgentSeverity>("UrgentModerate");
  const [doctorId, setDoctorId] = React.useState<number | null>(doctors[0]?.id ?? null);
  const [urgent, setUrgent] = React.useState(true);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Patient name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jordan Ellis" /></Field>
      <Field label="Age"><input style={inputStyle} value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 42" /></Field>
      <Field label="Reason for visit"><input style={inputStyle} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Shortness of breath" /></Field>
      <Field label="Assign doctor">
        <select style={inputStyle} value={doctorId ?? ""} onChange={(e) => setDoctorId(Number(e.target.value))}>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>)}
        </select>
      </Field>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: C.inkSoft }}>
        <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
        Flag as urgent case
      </label>
      {urgent && (
        <Field label="Severity">
          <select style={inputStyle} value={severity} onChange={(e) => setSeverity(e.target.value as UrgentSeverity)}>
            <option value="UrgentCritical">Critical</option>
            <option value="UrgentHigh">High</option>
            <option value="UrgentModerate">Moderate</option>
            <option value="UrgentLow">Low</option>
          </select>
        </Field>
      )}
      <PrimaryBtn
        onClick={() => {
          if (!name.trim()) return;
          onSubmit({
            name,
            age: Number(age) || 0,
            reasonForVisit: reason || "Not specified",
            status: urgent ? severity : "Waiting",
            doctorId,
          });
          onClose();
        }}
      >
        Add patient
      </PrimaryBtn>
    </div>
  );
}
