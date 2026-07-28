import * as React from "react";
import { Users, AlertTriangle, Stethoscope, CalendarDays } from "lucide-react";
import { C } from "../shared/tokens";
import { StatCard } from "../shared";
import { IDoctor, IPatient, IAppointment, INewsItem, IService } from "../../data/models";
import { IPermissions } from "../../context/usePermissions";
import { VitalsTicker } from "./VitalsTicker";
import { UrgentCasesPanel } from "../patients/UrgentCasesPanel";
import { DoctorAvailabilityPanel } from "../doctors/DoctorAvailabilityPanel";
import { AppointmentsPanel } from "../appointments/AppointmentsPanel";
import { NewsPanel } from "../news/NewsPanel";
import { ServicesStrip } from "../services/ServicesStrip";

export interface IDashboardViewProps {
  doctors: IDoctor[];
  urgentCases: IPatient[];
  appts: IAppointment[];
  news: INewsItem[];
  services: IService[];
  query: string;
  onSelectPatient: (p: IPatient) => void;
  onSelectDoctor: (d: IDoctor) => void;
}

const READ_ONLY_PERMISSIONS: IPermissions = {
  canAddPatient: false,
  canDischargePatient: false,
  canAdmitAsUrgent: false,
  canReassignPhysician: () => false,
  canAddDoctor: false,
  canRemoveDoctor: false,
  canToggleDoctorStatus: () => false,
  canBookAppointment: false,
  canCancelAppointment: false,
  canProgressAppointmentStatus: false,
  canManageService: () => false,
  canAddService: false,
  canManageNews: false,
};

function noop(): void {
  /* the dashboard overview's embedded panels are read-only; full actions live on each module's own view */
}

export function DashboardView({ doctors, urgentCases, appts, news, services, query, onSelectPatient, onSelectDoctor }: IDashboardViewProps): JSX.Element {
  const [newsExpanded, setNewsExpanded] = React.useState<number | null>(null);
  const available = doctors.filter((d) => d.status === "Available").length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <VitalsTicker urgentCount={urgentCases.length} availableCount={available} totalDoctors={doctors.length} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <StatCard label="Patients today" value="142" delta="8%" deltaDir="up" icon={Users as React.ComponentType<{ size?: number; color?: string }>} tint={C.teal} />
        <StatCard label="Urgent cases" value={urgentCases.length} delta="2" deltaDir="up" icon={AlertTriangle as React.ComponentType<{ size?: number; color?: string }>} tint={C.urgent} />
        <StatCard label="Doctors available" value={`${available}/${doctors.length}`} icon={Stethoscope as React.ComponentType<{ size?: number; color?: string }>} tint={C.primary} />
        <StatCard label="Appointments today" value={appts.length} delta="3%" deltaDir="down" icon={CalendarDays as React.ComponentType<{ size?: number; color?: string }>} tint={C.amber} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 18 }} className="dash-grid">
        <UrgentCasesPanel cases={urgentCases} onSelect={onSelectPatient} query={query} />
        <DoctorAvailabilityPanel doctors={doctors} appts={appts} onToggle={noop} onSelect={onSelectDoctor} query={query} permissions={READ_ONLY_PERMISSIONS} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(280px,1fr)", gap: 18 }} className="dash-grid">
        <AppointmentsPanel appts={appts} onCycleStatus={noop} onCancel={noop} onRemove={noop} query={query} permissions={READ_ONLY_PERMISSIONS} />
        <NewsPanel news={news} expanded={newsExpanded} setExpanded={setNewsExpanded} onDelete={noop} query={query} permissions={READ_ONLY_PERMISSIONS} />
      </div>
      <ServicesStrip services={services} onCallNext={noop} onToggleStatus={noop} query={query} permissions={READ_ONLY_PERMISSIONS} />
    </div>
  );
}
