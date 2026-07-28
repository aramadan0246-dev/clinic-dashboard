import * as React from "react";
import { Field, inputStyle, PrimaryBtn } from "../shared";
import { ServiceIcon } from "../../data/models";

export interface IAddServiceFormProps {
  onSubmit: (data: { name: string; description: string; icon: ServiceIcon }) => void;
  onClose: () => void;
}

const ICON_OPTIONS: ServiceIcon[] = ["Radiology", "Pharmacy", "Lab", "Emergency", "Physiotherapy", "Vaccination", "Other"];

export function AddServiceForm({ onSubmit, onClose }: IAddServiceFormProps): JSX.Element {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState<ServiceIcon>("Other");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Field label="Service name"><input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nutrition Counseling" /></Field>
      <Field label="Description"><input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Diet plans & consults" /></Field>
      <Field label="Icon">
        <select style={inputStyle} value={icon} onChange={(e) => setIcon(e.target.value as ServiceIcon)}>
          {ICON_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </Field>
      <PrimaryBtn
        onClick={() => {
          if (!name.trim()) return;
          onSubmit({ name, description: description || "Clinic service", icon });
          onClose();
        }}
      >
        Add service
      </PrimaryBtn>
    </div>
  );
}
