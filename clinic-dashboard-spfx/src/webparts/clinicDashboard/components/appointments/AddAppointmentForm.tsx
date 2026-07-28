import * as React from "react";
import { Field, inputStyle, PrimaryBtn } from "../shared";
import { IDoctor } from "../../data/models";

export interface IAddAppointmentFormProps {
  doctors: IDoctor[];
  onSubmit: (data: {
    patientName: string;
    apptDateTime: string;
    doctorId: number | null;
    visitType: string;
    room: string;
  }) => void;
  onClose: () => void;
}

export function combineTodayWithTime(hhmm: string): string {
  const [hours, minutes] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export function AddAppointmentForm({ doctors, onSubmit, onClose }: IAddAppointmentFormProps): JSX.Element {
  const [time, setTime] = React.useState("09:00");
  const [patientName, setPatientName] = React.useState("");
  const [doctorId, setDoctorId] = React.useState<number | null>(doctors[0]?.id ?? null);
  const [visitType, setVisitType] = React.useState("");
  const [room, setRoom] = React.useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Patient name"><input style={inputStyle} value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g. Jordan Ellis" /></Field>
      <Field label="Time"><input type="time" style={inputStyle} value={time} onChange={(e) => setTime(e.target.value)} /></Field>
      <Field label="Doctor">
        <select style={inputStyle} value={doctorId ?? ""} onChange={(e) => setDoctorId(Number(e.target.value))}>
          {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>)}
        </select>
      </Field>
      <Field label="Visit type"><input style={inputStyle} value={visitType} onChange={(e) => setVisitType(e.target.value)} placeholder="e.g. Follow-up · Cardiology" /></Field>
      <Field label="Room"><input style={inputStyle} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 204" /></Field>
      <PrimaryBtn
        onClick={() => {
          if (!patientName.trim()) return;
          onSubmit({
            patientName,
            apptDateTime: combineTodayWithTime(time),
            doctorId,
            visitType: visitType || "General visit",
            room: room || "—",
          });
          onClose();
        }}
      >
        Schedule appointment
      </PrimaryBtn>
    </div>
  );
}
