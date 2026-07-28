import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IAppointment, AppointmentStatus } from "./models";

interface IApptListItem {
  Id: number;
  Title: string;
  ApptDateTime: string;
  DoctorId: number | null;
  Doctor: { Title: string } | null;
  VisitType: string;
  Room: string;
  Status: AppointmentStatus;
}

function toAppointment(item: IApptListItem): IAppointment {
  return {
    id: item.Id,
    patientName: item.Title,
    apptDateTime: item.ApptDateTime,
    doctorId: item.DoctorId,
    doctorName: item.Doctor?.Title ?? "Unassigned",
    visitType: item.VisitType,
    room: item.Room,
    status: item.Status,
  };
}

export async function getAllAppointments(): Promise<IAppointment[]> {
  const sp = getSP();
  const items: IApptListItem[] = await sp.web.lists
    .getByTitle(LIST_NAMES.Appointments)
    .items.select(
      "Id",
      "Title",
      "ApptDateTime",
      "DoctorId",
      "Doctor/Title",
      "VisitType",
      "Room",
      "Status"
    )
    .expand("Doctor")
    .orderBy("ApptDateTime", true)
    .getAll();
  return items.map(toAppointment);
}

export async function addAppointment(data: {
  patientName: string;
  apptDateTime: string;
  doctorId: number | null;
  visitType: string;
  room: string;
}): Promise<IAppointment> {
  const sp = getSP();
  const result = await sp.web.lists.getByTitle(LIST_NAMES.Appointments).items.add({
    Title: data.patientName,
    ApptDateTime: data.apptDateTime,
    DoctorId: data.doctorId,
    VisitType: data.visitType,
    Room: data.room,
    Status: "Upcoming",
  });
  return toAppointment(result.data as IApptListItem);
}

export function cycleApptStatus(current: AppointmentStatus): AppointmentStatus {
  if (current === "Cancelled") return "Cancelled";
  const order: Record<AppointmentStatus, AppointmentStatus> = {
    Upcoming: "InProgress",
    InProgress: "Completed",
    Completed: "Upcoming",
    Cancelled: "Cancelled",
  };
  return order[current];
}

export async function updateApptStatus(id: number, status: AppointmentStatus): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Appointments).items.getById(id).update({ Status: status });
}

export async function cancelAppt(id: number): Promise<void> {
  return updateApptStatus(id, "Cancelled");
}

export async function removeAppt(id: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Appointments).items.getById(id).delete();
}
