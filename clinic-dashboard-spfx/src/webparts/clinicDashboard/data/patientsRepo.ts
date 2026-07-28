import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IPatient, PatientStatus, URGENT_STATUSES } from "./models";

interface IPatientListItem {
  Id: number;
  Title: string;
  MRN: string;
  Age: number;
  Status: PatientStatus;
  ReasonForVisit: string;
  AssignedDoctorId: number | null;
  AssignedDoctor: { Title: string } | null;
  FlaggedAt: string;
  HeartRate: number | null;
  BloodPressure: string;
  SPO: string;
  ClinicalNotes: string;
  LastVisit: string;
}

function toPatient(item: IPatientListItem): IPatient {
  return {
    id: item.Id,
    name: item.Title,
    mrn: item.MRN,
    age: item.Age,
    status: item.Status,
    reasonForVisit: item.ReasonForVisit,
    assignedDoctorId: item.AssignedDoctorId,
    assignedDoctorName: item.AssignedDoctor?.Title ?? "Unassigned",
    flaggedAt: item.FlaggedAt,
    heartRate: item.HeartRate,
    bloodPressure: item.BloodPressure,
    spo2: item.SPO,
    clinicalNotes: item.ClinicalNotes,
    lastVisit: item.LastVisit,
  };
}

export function isUrgent(status: PatientStatus): boolean {
  return URGENT_STATUSES.indexOf(status) !== -1;
}

export function generateMrn(): string {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `MRN-${n}`;
}

export function computeWaitLabel(flaggedAt: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(flaggedAt).getTime()) / 60000));
  return `${minutes} min`;
}

export async function getAllPatients(): Promise<IPatient[]> {
  const sp = getSP();
  const items: IPatientListItem[] = [];
  const query = sp.web.lists
    .getByTitle(LIST_NAMES.Patients)
    .items.select(
      "Id",
      "Title",
      "MRN",
      "Age",
      "Status",
      "ReasonForVisit",
      "AssignedDoctorId",
      "AssignedDoctor/Title",
      "FlaggedAt",
      "HeartRate",
      "BloodPressure",
      "SPO",
      "ClinicalNotes",
      "LastVisit"
    )
    .expand("AssignedDoctor");
  for await (const page of query) {
    items.push(...(page as IPatientListItem[]));
  }
  return items.map(toPatient);
}

export async function addPatient(data: {
  name: string;
  age: number;
  reasonForVisit: string;
  status: PatientStatus;
  doctorId: number | null;
}): Promise<IPatient> {
  const sp = getSP();
  const now = new Date().toISOString();
  const result = await sp.web.lists.getByTitle(LIST_NAMES.Patients).items.add({
    Title: data.name,
    MRN: generateMrn(),
    Age: data.age,
    Status: data.status,
    ReasonForVisit: data.reasonForVisit,
    AssignedDoctorId: data.doctorId,
    FlaggedAt: now,
    LastVisit: now,
  });
  return toPatient(result.data as IPatientListItem);
}

export async function dischargePatient(id: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Patients).items.getById(id).update({
    Status: "Discharged" as PatientStatus,
  });
}

export async function admitAsUrgent(
  id: number,
  severity: "UrgentCritical" | "UrgentHigh" | "UrgentModerate" | "UrgentLow"
): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Patients).items.getById(id).update({
    Status: severity,
    FlaggedAt: new Date().toISOString(),
  });
}

export async function reassignDoctor(id: number, doctorId: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Patients).items.getById(id).update({
    AssignedDoctorId: doctorId,
  });
}
