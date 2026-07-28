// src/webparts/clinicDashboard/context/ClinicDataProvider.tsx
import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { initPnp } from "../data/pnpConfig";
import { IDoctor, IPatient, IAppointment, IService, INewsItem, IStaffRole, PatientStatus, DoctorStatus, AppointmentStatus, ServiceIcon, NewsCategory } from "../data/models";
import * as doctorsRepo from "../data/doctorsRepo";
import * as patientsRepo from "../data/patientsRepo";
import * as apptsRepo from "../data/appointmentsRepo";
import * as servicesRepo from "../data/servicesRepo";
import * as newsRepo from "../data/newsRepo";
import * as staffRolesRepo from "../data/staffRolesRepo";
import { logAudit } from "../data/auditRepo";
import { useCurrentUserRole, ICurrentUserRole } from "./useCurrentUserRole";

export interface IToast {
  id: string;
  msg: string;
  tone: "ok" | "error";
}

export interface IClinicData {
  status: "loading" | "ready" | "error";
  doctors: IDoctor[];
  patients: IPatient[];
  appointments: IAppointment[];
  services: IService[];
  news: INewsItem[];
  staffRoles: IStaffRole[];
  currentUserRole: ICurrentUserRole;
  toasts: IToast[];

  addPatient: (data: { name: string; age: number; reasonForVisit: string; status: PatientStatus; doctorId: number | null }) => Promise<void>;
  dischargeUrgent: (patient: IPatient) => Promise<void>;
  admitAsUrgent: (patient: IPatient, severity: "UrgentCritical" | "UrgentHigh" | "UrgentModerate" | "UrgentLow") => Promise<void>;
  reassignDoctor: (patient: IPatient, doctorId: number, doctorName: string) => Promise<void>;

  toggleDoctorStatus: (doctor: IDoctor) => Promise<void>;
  addDoctor: (data: { name: string; specialty: string; room: string }) => Promise<void>;
  removeDoctor: (doctor: IDoctor) => Promise<void>;

  addAppointment: (data: { patientName: string; apptDateTime: string; doctorId: number | null; visitType: string; room: string }) => Promise<void>;
  cycleAppt: (appt: IAppointment) => Promise<void>;
  cancelAppt: (appt: IAppointment) => Promise<void>;
  removeAppt: (appt: IAppointment) => Promise<void>;

  toggleServiceStatus: (service: IService) => Promise<void>;
  callNext: (service: IService) => Promise<void>;
  addService: (data: { name: string; description: string; icon: ServiceIcon }) => Promise<void>;

  addNews: (data: { title: string; category: NewsCategory; excerpt: string; body: string }) => Promise<void>;
  deleteNews: (news: INewsItem) => Promise<void>;
}

const ClinicDataContext = React.createContext<IClinicData | undefined>(undefined);

function uid(prefix: string): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}`;
}

export const ClinicDataProvider: React.FC<{ context: WebPartContext; children: React.ReactNode }> = ({
  context,
  children,
}) => {
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">("loading");
  const [doctors, setDoctors] = React.useState<IDoctor[]>([]);
  const [patients, setPatients] = React.useState<IPatient[]>([]);
  const [appointments, setAppointments] = React.useState<IAppointment[]>([]);
  const [services, setServices] = React.useState<IService[]>([]);
  const [news, setNews] = React.useState<INewsItem[]>([]);
  const [staffRoles, setStaffRoles] = React.useState<IStaffRole[]>([]);
  const [toasts, setToasts] = React.useState<IToast[]>([]);

  const pushToast = React.useCallback((msg: string, tone: "ok" | "error" = "ok") => {
    const id = uid("t");
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  React.useEffect(() => {
    initPnp(context);
    let cancelled = false;
    void (async () => {
      try {
        const [d, p, a, s, n, r] = await Promise.all([
          doctorsRepo.getAllDoctors(),
          patientsRepo.getAllPatients(),
          apptsRepo.getAllAppointments(),
          servicesRepo.getAllServices(),
          newsRepo.getAllNews(),
          staffRolesRepo.getAllStaffRoles(),
        ]);
        if (cancelled) return;
        setDoctors(d);
        setPatients(p);
        setAppointments(a);
        setServices(s);
        setNews(n);
        setStaffRoles(r);
        setStatus("ready");
      } catch (e) {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [context]);

  const currentUserRole = useCurrentUserRole(context.pageContext.user.loginName, staffRoles);

  const toggleDoctorStatus = React.useCallback(
    async (doctor: IDoctor) => {
      const next = doctorsRepo.cycleDoctorStatus(doctor.status);
      setDoctors((prev) => prev.map((d) => (d.id === doctor.id ? { ...d, status: next } : d)));
      try {
        await doctorsRepo.updateDoctorStatus(doctor.id, next);
        await logAudit({ action: "DoctorStatusChanged", targetTitle: doctor.name, details: next });
      } catch (e) {
        setDoctors((prev) => prev.map((d) => (d.id === doctor.id ? doctor : d)));
        pushToast(`Failed to update ${doctor.name}'s status`, "error");
      }
    },
    [pushToast]
  );

  const addDoctor = React.useCallback(
    async (data: { name: string; specialty: string; room: string }) => {
      try {
        const created = await doctorsRepo.addDoctor(data);
        setDoctors((prev) => [created, ...prev]);
        await logAudit({ action: "DoctorAdded", targetTitle: data.name });
        pushToast(`${data.name} added to staff`);
      } catch (e) {
        pushToast(`Failed to add ${data.name}`, "error");
      }
    },
    [pushToast]
  );

  const removeDoctor = React.useCallback(
    async (doctor: IDoctor) => {
      const prevDoctors = doctors;
      setDoctors((prev) => prev.filter((d) => d.id !== doctor.id));
      try {
        await doctorsRepo.removeDoctor(doctor.id);
        await logAudit({ action: "DoctorRemoved", targetTitle: doctor.name });
        pushToast(`${doctor.name} removed from staff list`);
      } catch (e) {
        setDoctors(prevDoctors);
        pushToast(`Failed to remove ${doctor.name}`, "error");
      }
    },
    [doctors, pushToast]
  );

  const addPatient = React.useCallback(
    async (data: { name: string; age: number; reasonForVisit: string; status: PatientStatus; doctorId: number | null }) => {
      try {
        const created = await patientsRepo.addPatient(data);
        setPatients((prev) => [created, ...prev]);
        await logAudit({ action: "PatientAdded", targetTitle: data.name });
        pushToast(`${data.name} added`);
      } catch (e) {
        pushToast(`Failed to add ${data.name}`, "error");
      }
    },
    [pushToast]
  );

  const dischargeUrgent = React.useCallback(
    async (patient: IPatient) => {
      const prevPatients = patients;
      setPatients((prev) => prev.map((p) => (p.id === patient.id ? { ...p, status: "Discharged" } : p)));
      try {
        await patientsRepo.dischargePatient(patient.id);
        await logAudit({ action: "PatientDischarged", targetTitle: patient.name });
        pushToast(`${patient.name} discharged`);
      } catch (e) {
        setPatients(prevPatients);
        pushToast(`Failed to discharge ${patient.name}`, "error");
      }
    },
    [patients, pushToast]
  );

  const admitAsUrgent = React.useCallback(
    async (patient: IPatient, severity: "UrgentCritical" | "UrgentHigh" | "UrgentModerate" | "UrgentLow") => {
      const prevPatients = patients;
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? { ...p, status: severity, flaggedAt: new Date().toISOString() } : p))
      );
      try {
        await patientsRepo.admitAsUrgent(patient.id, severity);
        await logAudit({ action: "PatientAdmittedUrgent", targetTitle: patient.name, details: severity });
        pushToast(`${patient.name} admitted as urgent`, "error");
      } catch (e) {
        setPatients(prevPatients);
        pushToast(`Failed to escalate ${patient.name}`, "error");
      }
    },
    [patients, pushToast]
  );

  const reassignDoctor = React.useCallback(
    async (patient: IPatient, doctorId: number, doctorName: string) => {
      const prevPatients = patients;
      setPatients((prev) =>
        prev.map((p) => (p.id === patient.id ? { ...p, assignedDoctorId: doctorId, assignedDoctorName: doctorName } : p))
      );
      try {
        await patientsRepo.reassignDoctor(patient.id, doctorId);
        await logAudit({ action: "PhysicianReassigned", targetTitle: patient.name, details: doctorName });
      } catch (e) {
        setPatients(prevPatients);
        pushToast(`Failed to reassign ${patient.name}`, "error");
      }
    },
    [patients, pushToast]
  );

  const addAppointment = React.useCallback(
    async (data: { patientName: string; apptDateTime: string; doctorId: number | null; visitType: string; room: string }) => {
      try {
        const created = await apptsRepo.addAppointment(data);
        setAppointments((prev) => [...prev, created]);
        await logAudit({ action: "AppointmentBooked", targetTitle: data.patientName });
        pushToast(`Appointment booked for ${data.patientName}`);
      } catch (e) {
        pushToast(`Failed to book appointment for ${data.patientName}`, "error");
      }
    },
    [pushToast]
  );

  const cycleAppt = React.useCallback(
    async (appt: IAppointment) => {
      const next = apptsRepo.cycleApptStatus(appt.status);
      setAppointments((prev) => prev.map((a) => (a.id === appt.id ? { ...a, status: next } : a)));
      try {
        await apptsRepo.updateApptStatus(appt.id, next);
        await logAudit({ action: "AppointmentStatusChanged", targetTitle: appt.patientName, details: next });
      } catch (e) {
        setAppointments((prev) => prev.map((a) => (a.id === appt.id ? appt : a)));
        pushToast(`Failed to update appointment for ${appt.patientName}`, "error");
      }
    },
    [pushToast]
  );

  const cancelAppt = React.useCallback(
    async (appt: IAppointment) => {
      const prevAppts = appointments;
      setAppointments((prev) => prev.map((a) => (a.id === appt.id ? { ...a, status: "Cancelled" } : a)));
      try {
        await apptsRepo.cancelAppt(appt.id);
        await logAudit({ action: "AppointmentCancelled", targetTitle: appt.patientName });
        pushToast("Appointment cancelled", "error");
      } catch (e) {
        setAppointments(prevAppts);
        pushToast(`Failed to cancel appointment for ${appt.patientName}`, "error");
      }
    },
    [appointments, pushToast]
  );

  const removeAppt = React.useCallback(
    async (appt: IAppointment) => {
      const prevAppts = appointments;
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
      try {
        await apptsRepo.removeAppt(appt.id);
        pushToast("Appointment removed");
      } catch (e) {
        setAppointments(prevAppts);
        pushToast("Failed to remove appointment", "error");
      }
    },
    [appointments, pushToast]
  );

  const toggleServiceStatus = React.useCallback(
    async (service: IService) => {
      const next = servicesRepo.flipServiceStatus(service.status);
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, status: next } : s)));
      try {
        await servicesRepo.toggleServiceStatus(service.id, service.status);
        await logAudit({ action: "ServiceStatusChanged", targetTitle: service.name, details: next });
      } catch (e) {
        setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
        pushToast(`Failed to update ${service.name}`, "error");
      }
    },
    [pushToast]
  );

  const callNext = React.useCallback(
    async (service: IService) => {
      const next = servicesRepo.decrementQueue(service.queue);
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, queue: next } : s)));
      try {
        await servicesRepo.callNext(service.id, service.queue);
        await logAudit({ action: "ServiceQueueCalled", targetTitle: service.name });
      } catch (e) {
        setServices((prev) => prev.map((s) => (s.id === service.id ? service : s)));
        pushToast(`Failed to call next for ${service.name}`, "error");
      }
    },
    [pushToast]
  );

  const addService = React.useCallback(
    async (data: { name: string; description: string; icon: ServiceIcon }) => {
      try {
        const created = await servicesRepo.addService(data);
        setServices((prev) => [created, ...prev]);
        await logAudit({ action: "ServiceAdded", targetTitle: data.name });
        pushToast(`${data.name} added to services`);
      } catch (e) {
        pushToast(`Failed to add ${data.name}`, "error");
      }
    },
    [pushToast]
  );

  const addNews = React.useCallback(
    async (data: { title: string; category: NewsCategory; excerpt: string; body: string }) => {
      try {
        const created = await newsRepo.addNews(data);
        setNews((prev) => [created, ...prev]);
        await logAudit({ action: "NewsPublished", targetTitle: data.title });
        pushToast("Announcement published");
      } catch (e) {
        pushToast(`Failed to publish "${data.title}"`, "error");
      }
    },
    [pushToast]
  );

  const deleteNews = React.useCallback(
    async (item: INewsItem) => {
      const prevNews = news;
      setNews((prev) => prev.filter((n) => n.id !== item.id));
      try {
        await newsRepo.removeNews(item.id);
        await logAudit({ action: "NewsRemoved", targetTitle: item.title });
        pushToast("Announcement removed");
      } catch (e) {
        setNews(prevNews);
        pushToast(`Failed to remove "${item.title}"`, "error");
      }
    },
    [news, pushToast]
  );

  const value: IClinicData = {
    status,
    doctors,
    patients,
    appointments,
    services,
    news,
    staffRoles,
    currentUserRole,
    toasts,
    addPatient,
    dischargeUrgent,
    admitAsUrgent,
    reassignDoctor,
    toggleDoctorStatus,
    addDoctor,
    removeDoctor,
    addAppointment,
    cycleAppt,
    cancelAppt,
    removeAppt,
    toggleServiceStatus,
    callNext,
    addService,
    addNews,
    deleteNews,
  };

  return <ClinicDataContext.Provider value={value}>{children}</ClinicDataContext.Provider>;
};

export function useClinicData(): IClinicData {
  const ctx = React.useContext(ClinicDataContext);
  if (!ctx) throw new Error("useClinicData must be used within a ClinicDataProvider");
  return ctx;
}
