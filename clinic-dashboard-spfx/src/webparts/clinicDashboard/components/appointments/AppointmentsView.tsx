import * as React from "react";
import { C } from "../shared/tokens";
import { IAppointment, IDoctor, AppointmentStatus } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";
import { AppointmentsPanel } from "./AppointmentsPanel";

export interface IAppointmentsViewProps {
  appts: IAppointment[];
  doctors: IDoctor[];
  query: string;
  onCycleStatus: (id: number) => void;
  onCancel: (id: number) => void;
  onRemove: (id: number) => void;
  onNew: () => void;
  permissions: IPermissions;
}

type FilterId = "all" | AppointmentStatus;

const TABS: Array<{ id: FilterId; label: string }> = [
  { id: "all", label: "All" },
  { id: "Upcoming", label: "Upcoming" },
  { id: "InProgress", label: "In progress" },
  { id: "Completed", label: "Completed" },
  { id: "Cancelled", label: "Cancelled" },
];

export function AppointmentsView({ appts, doctors, query, onCycleStatus, onCancel, onRemove, onNew, permissions }: IAppointmentsViewProps): JSX.Element {
  const [filter, setFilter] = React.useState<FilterId>("all");
  const filtered = filter === "all" ? appts : appts.filter((a) => a.status === filter);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{ border: `1px solid ${filter === t.id ? C.primary : C.border}`, background: filter === t.id ? C.primary : C.surface, color: filter === t.id ? "#fff" : C.inkSoft, borderRadius: 999, padding: "7px 14px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <AppointmentsPanel
        appts={filtered}
        onCycleStatus={onCycleStatus}
        onCancel={onCancel}
        onRemove={onRemove}
        query={query}
        onNew={permissions.canBookAppointment ? onNew : undefined}
        permissions={permissions}
      />
    </div>
  );
}
