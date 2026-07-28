import * as React from "react";
import { Field, inputStyle, PrimaryBtn } from "../shared";

export interface IAddDoctorFormProps {
  onSubmit: (data: { name: string; specialty: string; room: string }) => void;
  onClose: () => void;
}

export function AddDoctorForm({ onSubmit, onClose }: IAddDoctorFormProps): JSX.Element {
  const [name, setName] = React.useState("");
  const [specialty, setSpecialty] = React.useState("");
  const [room, setRoom] = React.useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Full name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Jane Okoro" /></Field>
      <Field label="Specialty"><input style={inputStyle} value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="e.g. Endocrinology" /></Field>
      <Field label="Room"><input style={inputStyle} value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 210" /></Field>
      <PrimaryBtn
        onClick={() => {
          if (!name.trim()) return;
          onSubmit({ name: name.startsWith("Dr.") ? name : `Dr. ${name}`, specialty: specialty || "General Medicine", room: room || "—" });
          onClose();
        }}
      >
        Add doctor
      </PrimaryBtn>
    </div>
  );
}
