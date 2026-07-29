import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IDoctor, DoctorStatus } from "./models";

interface IDoctorListItem {
  Id: number;
  Title: string;
  Specialty: string;
  Room: string;
  Status: DoctorStatus;
}

function toDoctor(item: IDoctorListItem): IDoctor {
  return {
    id: item.Id,
    name: item.Title,
    specialty: item.Specialty,
    room: item.Room,
    status: item.Status,
  };
}

export async function getAllDoctors(): Promise<IDoctor[]> {
  const sp = getSP();
  const items: IDoctorListItem[] = [];
  const query = sp.web.lists
    .getByTitle(LIST_NAMES.Doctors)
    .items.select("Id", "Title", "Specialty", "Room", "Status");
  for await (const page of query) {
    items.push(...(page as IDoctorListItem[]));
  }
  return items.map(toDoctor);
}

export async function addDoctor(data: {
  name: string;
  specialty: string;
  room: string;
}): Promise<IDoctor> {
  const sp = getSP();
  const result = await sp.web.lists.getByTitle(LIST_NAMES.Doctors).items.add({
    Title: data.name,
    Specialty: data.specialty,
    Room: data.room,
    Status: "Available",
  });
  return toDoctor(result as IDoctorListItem);
}

export async function updateDoctorStatus(id: number, status: DoctorStatus): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Doctors).items.getById(id).update({ Status: status });
}

export async function removeDoctor(id: number): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.Doctors).items.getById(id).delete();
}

export function cycleDoctorStatus(current: DoctorStatus): DoctorStatus {
  const order: Record<DoctorStatus, DoctorStatus> = {
    Available: "Busy",
    Busy: "OffDuty",
    OffDuty: "Available",
  };
  return order[current];
}

interface IApptForNextSlot {
  doctorId: number | null;
  apptDateTime: string;
  status: string;
}

export function computeNextSlot(doctorId: number, appointments: IApptForNextSlot[]): string {
  const now = Date.now();
  const upcoming = appointments
    .filter(
      (a) =>
        a.doctorId === doctorId &&
        a.status !== "Cancelled" &&
        new Date(a.apptDateTime).getTime() >= now
    )
    .sort((a, b) => new Date(a.apptDateTime).getTime() - new Date(b.apptDateTime).getTime());
  if (upcoming.length === 0) return "No upcoming slots";
  const next = new Date(upcoming[0].apptDateTime);
  const diffMs = next.getTime() - now;
  if (diffMs < 15 * 60 * 1000) return "Now";
  return next.toLocaleString(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });
}
