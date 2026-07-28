// src/webparts/clinicDashboard/data/models.ts

export type DoctorStatus = "Available" | "Busy" | "OffDuty";

export interface IDoctor {
  id: number;
  name: string;
  specialty: string;
  room: string;
  status: DoctorStatus;
}

export type PatientStatus =
  | "Waiting"
  | "UrgentCritical"
  | "UrgentHigh"
  | "UrgentModerate"
  | "UrgentLow"
  | "Discharged";

export const URGENT_STATUSES: PatientStatus[] = [
  "UrgentCritical",
  "UrgentHigh",
  "UrgentModerate",
  "UrgentLow",
];

export interface IPatient {
  id: number;
  name: string;
  mrn: string;
  age: number;
  status: PatientStatus;
  reasonForVisit: string;
  assignedDoctorId: number | null;
  assignedDoctorName: string;
  flaggedAt: string; // ISO 8601
  heartRate: number | null;
  bloodPressure: string;
  spo2: string;
  clinicalNotes: string;
  lastVisit: string; // ISO 8601
}

export type AppointmentStatus = "Upcoming" | "InProgress" | "Completed" | "Cancelled";

export interface IAppointment {
  id: number;
  patientName: string;
  apptDateTime: string; // ISO 8601
  doctorId: number | null;
  doctorName: string;
  visitType: string;
  room: string;
  status: AppointmentStatus;
}

export type ServiceIcon =
  | "Radiology"
  | "Pharmacy"
  | "Lab"
  | "Emergency"
  | "Physiotherapy"
  | "Vaccination"
  | "Other";

export type ServiceStatus = "Open" | "Closed";

export interface IService {
  id: number;
  name: string;
  description: string;
  icon: ServiceIcon;
  status: ServiceStatus;
  queue: number;
}

export type NewsCategory = "Policy" | "Supplies" | "Staff" | "Facilities";

export interface INewsItem {
  id: number;
  title: string;
  category: NewsCategory;
  excerpt: string;
  body: string;
  createdDate: string; // ISO 8601, from list Created field
  author: string;
}

export type StaffRoleName =
  | "ChargeNurse"
  | "Physician"
  | "FrontDeskCoordinator"
  | "DepartmentLead"
  | "CommunicationsStaff"
  | "ClinicalOperationsDirector";

export interface IStaffRole {
  id: number;
  userLoginName: string;
  userDisplayName: string;
  role: StaffRoleName;
  departmentServiceId: number | null;
  doctorId: number | null;
}

export type AuditAction =
  | "PatientAdded"
  | "PatientDischarged"
  | "PatientAdmittedUrgent"
  | "PhysicianReassigned"
  | "AppointmentBooked"
  | "AppointmentCancelled"
  | "AppointmentStatusChanged"
  | "DoctorStatusChanged"
  | "DoctorAdded"
  | "DoctorRemoved"
  | "ServiceStatusChanged"
  | "ServiceQueueCalled"
  | "ServiceAdded"
  | "NewsPublished"
  | "NewsRemoved";

export interface IAuditEntry {
  action: AuditAction;
  targetTitle: string;
  details?: string;
}
