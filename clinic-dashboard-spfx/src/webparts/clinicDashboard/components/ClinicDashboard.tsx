import * as React from "react";
import {
  LayoutDashboard, Users, Stethoscope, CalendarDays, Boxes, Newspaper,
  Search, Bell, ShieldCheck, Menu,
} from "lucide-react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { C, FONTS } from "./shared/tokens";
import { Avatar, Modal, ToastStack } from "./shared";
import { IDoctor, IPatient } from "../data/models";
import { isUrgent } from "../data/patientsRepo";
import { ClinicDataProvider, useClinicData } from "../context/ClinicDataProvider";
import { usePermissions } from "../context/usePermissions";
import { DashboardView } from "./dashboard/DashboardView";
import { PatientsView } from "./patients/PatientsView";
import { PatientDrawer } from "./patients/PatientDrawer";
import { AddPatientForm } from "./patients/AddPatientForm";
import { DoctorsView } from "./doctors/DoctorsView";
import { DoctorDrawer } from "./doctors/DoctorDrawer";
import { AddDoctorForm } from "./doctors/AddDoctorForm";
import { AppointmentsView } from "./appointments/AppointmentsView";
import { AddAppointmentForm } from "./appointments/AddAppointmentForm";
import { ServicesStrip } from "./services/ServicesStrip";
import { AddServiceForm } from "./services/AddServiceForm";
import { NewsPanel } from "./news/NewsPanel";
import { AddNewsForm } from "./news/AddNewsForm";

export interface IClinicDashboardProps {
  context: WebPartContext;
}

type ViewId = "dashboard" | "patients" | "doctors" | "appointments" | "services" | "news";
type ModalId = "patient" | "doctor" | "appointment" | "service" | "news" | null;

const NAV: Array<{ id: ViewId; label: string; icon: React.ElementType }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "patients", label: "Patients", icon: Users },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "appointments", label: "Appointments", icon: CalendarDays },
  { id: "services", label: "Services", icon: Boxes },
  { id: "news", label: "News", icon: Newspaper },
];

const VIEW_META: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Live overview across the clinic" },
  patients: { title: "Patients", subtitle: "Roster, admissions and discharges" },
  doctors: { title: "Doctors", subtitle: "Staff availability and workload" },
  appointments: { title: "Appointments", subtitle: "Book, update and cancel visits" },
  services: { title: "Services", subtitle: "Departments and queue status" },
  news: { title: "News", subtitle: "Post and manage announcements" },
};

function ClinicDashboardContent({ context }: IClinicDashboardProps): JSX.Element {
  const data = useClinicData();
  const permissions = usePermissions(data.currentUserRole);

  const [view, setView] = React.useState<ViewId>("dashboard");
  const [newsExpanded, setNewsExpanded] = React.useState<number | null>(null);
  const [selectedPatient, setSelectedPatient] = React.useState<IPatient | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = React.useState<IDoctor | undefined>(undefined);
  const [query, setQuery] = React.useState("");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [modal, setModal] = React.useState<ModalId>(null);

  const today = React.useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    []
  );

  const urgentCases = data.patients.filter((p) => isUrgent(p.status));
  const roster = data.patients.filter((p) => !isUrgent(p.status));
  const viewMeta = VIEW_META[view];

  const findDoctor = (id: number): IDoctor | undefined => data.doctors.find((d) => d.id === id);
  const findAppt = (id: number) => data.appointments.find((a) => a.id === id);
  const findService = (id: number) => data.services.find((s) => s.id === id);
  const findNews = (id: number) => data.news.find((n) => n.id === id);
  const findPatient = (id: number): IPatient | undefined => data.patients.find((p) => p.id === id);

  const onToggleDoctor = (doctorId: number): void => {
    const doctor = findDoctor(doctorId);
    if (doctor) void data.toggleDoctorStatus(doctor);
  };
  const onRemoveDoctor = (doctorId: number): void => {
    const doctor = findDoctor(doctorId);
    if (doctor) void data.removeDoctor(doctor);
  };
  const onCycleAppt = (id: number): void => {
    const appt = findAppt(id);
    if (appt) void data.cycleAppt(appt);
  };
  const onCancelAppt = (id: number): void => {
    const appt = findAppt(id);
    if (appt) void data.cancelAppt(appt);
  };
  const onRemoveAppt = (id: number): void => {
    const appt = findAppt(id);
    if (appt) void data.removeAppt(appt);
  };
  const onCallNext = (id: number): void => {
    const service = findService(id);
    if (service) void data.callNext(service);
  };
  const onToggleServiceStatus = (id: number): void => {
    const service = findService(id);
    if (service) void data.toggleServiceStatus(service);
  };
  const onDeleteNews = (id: number): void => {
    const item = findNews(id);
    if (item) void data.deleteNews(item);
  };
  const onAssignDoctor = (patientId: number, doctorId: number): void => {
    const patient = findPatient(patientId);
    const doctor = findDoctor(doctorId);
    if (patient && doctor) void data.reassignDoctor(patient, doctor.id, doctor.name);
  };
  const onDischargePatient = (patientId: number): void => {
    const patient = findPatient(patientId);
    if (patient) void data.dischargeUrgent(patient);
  };
  const onAdmitAsUrgent = (patient: IPatient): void => {
    void data.admitAsUrgent(patient, "UrgentHigh");
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif", color: C.ink }}>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        ::selection { background: ${C.tealSoft}; }
        @media (max-width: 880px) {
          .dash-grid { grid-template-columns: 1fr !important; }
          .sidebar { position: fixed !important; left: var(--sb-x, -260px); top: 0; bottom: 0; z-index: 40; transition: left .2s ease; }
          .menu-btn { display: flex !important; }
        }
        a, button:focus-visible, [tabindex]:focus-visible { outline: 2px solid ${C.teal}; outline-offset: 2px; }
        .CanvasZone > :first-child, .CanvasZone { max-width: 100% !important; }
        .CanvasSection-xl4 > :first-child { margin: 0px !important; padding: 0px !important; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside className="sidebar" style={{ width: 232, flexShrink: 0, background: C.primary, padding: "22px 14px", display: "flex", flexDirection: "column", gap: 22, ["--sb-x" as any]: mobileNavOpen ? "0px" : "-260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#ffffff1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={18} color="#8FD9C9" />
            </div>
            <div style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 15.5, color: "#fff" }}>B-Well Clinic</div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {NAV.map((n) => {
              const active = view === n.id;
              const Icon = n.icon;
              return (
                <button key={n.id} onClick={() => { setView(n.id); setMobileNavOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", background: active ? "#ffffff14" : "transparent", color: active ? "#fff" : "#C9DDD9" }}>
                  <Icon size={17} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5 }}>{n.label}</span>
                  {n.id === "patients" && <span style={{ marginLeft: "auto", background: C.urgent, color: "#fff", fontSize: 10.5, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{urgentCases.length}</span>}
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: "auto", padding: 14, background: "#ffffff0F", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials="SB" color="#8FD9C9" size={36} />
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: "#fff" }}>{context.pageContext.user.displayName}</div>
                <div style={{ fontSize: 11, color: "#9FC2BB" }}>{data.currentUserRole.role ?? "Read-only"}</div>
              </div>
            </div>
          </div>
        </aside>

        {mobileNavOpen && <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, background: "#0F272366", zIndex: 30 }} />}

        <main style={{ flex: 1, minWidth: 0, padding: "20px 26px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 22, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setMobileNavOpen(true)} className="menu-btn" style={{ display: "none", border: `1px solid ${C.border}`, background: C.surface, borderRadius: 9, width: 36, height: 36, alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Menu size={17} />
              </button>
              <div>
                <h1 style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: 21, margin: 0, color: C.ink }}>{viewMeta.title}</h1>
                <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>
                  <span>{viewMeta.subtitle}</span> · <span>{today}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <Search size={15} color={C.inkFaint} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search patients, doctors…" style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 10, padding: "9px 12px 9px 32px", fontSize: 13, fontFamily: "Inter, sans-serif", width: 220, color: C.ink }} />
              </div>
              <button style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
                <Bell size={16} color={C.inkSoft} />
                <span style={{ position: "absolute", top: 6, right: 7, width: 6, height: 6, borderRadius: 999, background: C.urgent }} />
              </button>
              <Avatar initials="SB" color={C.primary} size={36} />
            </div>
          </div>

          {data.status === "loading" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, height: 90, opacity: 0.6 }} />
              ))}
            </div>
          )}

          {data.status === "error" && (
            <div style={{ background: C.urgentSoft, border: `1px solid ${C.urgent}`, borderRadius: 16, padding: 20, color: C.urgent, fontFamily: "Inter, sans-serif" }}>
              <div>Couldn&apos;t load clinic data. Please refresh the page to try again.</div>
              {data.errorMessage && (
                <div style={{ marginTop: 8, fontFamily: "IBM Plex Mono, monospace", fontSize: 12, opacity: 0.85 }}>
                  {data.errorMessage}
                </div>
              )}
            </div>
          )}

          {data.status === "ready" && (
            <>
              {view === "dashboard" && (
                <DashboardView
                  doctors={data.doctors}
                  urgentCases={urgentCases}
                  appts={data.appointments}
                  news={data.news}
                  services={data.services}
                  query={query}
                  onSelectPatient={setSelectedPatient}
                  onSelectDoctor={setSelectedDoctor}
                />
              )}
              {view === "patients" && (
                <PatientsView
                  urgentCases={urgentCases}
                  roster={roster}
                  doctors={data.doctors}
                  query={query}
                  onSelectPatient={setSelectedPatient}
                  onNewPatient={() => setModal("patient")}
                  onAdmit={onAdmitAsUrgent}
                  onDischargeRoster={onDischargePatient}
                  permissions={permissions}
                />
              )}
              {view === "doctors" && (
                <DoctorsView
                  doctors={data.doctors}
                  appts={data.appointments}
                  query={query}
                  onToggle={onToggleDoctor}
                  onSelect={setSelectedDoctor}
                  onNew={() => setModal("doctor")}
                  permissions={permissions}
                />
              )}
              {view === "appointments" && (
                <AppointmentsView
                  appts={data.appointments}
                  doctors={data.doctors}
                  query={query}
                  onCycleStatus={onCycleAppt}
                  onCancel={onCancelAppt}
                  onRemove={onRemoveAppt}
                  onNew={() => setModal("appointment")}
                  permissions={permissions}
                />
              )}
              {view === "services" && (
                <ServicesStrip
                  services={data.services}
                  onCallNext={onCallNext}
                  onToggleStatus={onToggleServiceStatus}
                  query={query}
                  onNew={() => setModal("service")}
                  permissions={permissions}
                />
              )}
              {view === "news" && (
                <NewsPanel
                  news={data.news}
                  expanded={newsExpanded}
                  setExpanded={setNewsExpanded}
                  onDelete={onDeleteNews}
                  query={query}
                  onNew={() => setModal("news")}
                  permissions={permissions}
                />
              )}
            </>
          )}
        </main>
      </div>

      <PatientDrawer patient={selectedPatient} onClose={() => setSelectedPatient(undefined)} doctors={data.doctors} onAssignDoctor={onAssignDoctor} onDischarge={onDischargePatient} permissions={permissions} />
      <DoctorDrawer doctor={selectedDoctor} onClose={() => setSelectedDoctor(undefined)} onToggle={onToggleDoctor} appts={data.appointments} onRemove={onRemoveDoctor} permissions={permissions} />

      {modal === "patient" && (
        <Modal title="Add patient" onClose={() => setModal(null)}>
          <AddPatientForm doctors={data.doctors} onSubmit={(d) => void data.addPatient(d)} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "doctor" && (
        <Modal title="Add doctor" onClose={() => setModal(null)}>
          <AddDoctorForm onSubmit={(d) => void data.addDoctor(d)} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "appointment" && (
        <Modal title="New appointment" onClose={() => setModal(null)}>
          <AddAppointmentForm doctors={data.doctors} onSubmit={(d) => void data.addAppointment(d)} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "service" && (
        <Modal title="Add service" onClose={() => setModal(null)}>
          <AddServiceForm onSubmit={(d) => void data.addService(d)} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal === "news" && (
        <Modal title="New announcement" onClose={() => setModal(null)} width={480}>
          <AddNewsForm onSubmit={(d) => void data.addNews(d)} onClose={() => setModal(null)} />
        </Modal>
      )}

      <ToastStack toasts={data.toasts} />
    </div>
  );
}

export function ClinicDashboard({ context }: IClinicDashboardProps): JSX.Element {
  return (
    <ClinicDataProvider context={context}>
      <ClinicDashboardContent context={context} />
    </ClinicDataProvider>
  );
}
