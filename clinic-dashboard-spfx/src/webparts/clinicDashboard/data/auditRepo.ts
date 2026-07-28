import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IAuditEntry, AuditAction } from "./models";

const ACTION_LABELS: Record<AuditAction, string> = {
  PatientAdded: "Add patient",
  PatientDischarged: "Discharge",
  PatientAdmittedUrgent: "Admit as urgent",
  PhysicianReassigned: "Reassign physician",
  AppointmentBooked: "Book appointment",
  AppointmentCancelled: "Cancel appointment",
  AppointmentStatusChanged: "Update appointment status",
  DoctorStatusChanged: "Update doctor status",
  DoctorAdded: "Add doctor",
  DoctorRemoved: "Remove doctor",
  ServiceStatusChanged: "Update service status",
  ServiceQueueCalled: "Call next in queue",
  ServiceAdded: "Add service",
  NewsPublished: "Publish announcement",
  NewsRemoved: "Remove announcement",
};

export function buildAuditTitle(action: AuditAction, targetTitle: string): string {
  return `${ACTION_LABELS[action]}: ${targetTitle}`;
}

export async function logAudit(entry: IAuditEntry): Promise<void> {
  const sp = getSP();
  await sp.web.lists.getByTitle(LIST_NAMES.AuditLog).items.add({
    Title: buildAuditTitle(entry.action, entry.targetTitle),
    Action: entry.action,
    TargetTitle: entry.targetTitle,
    Details: entry.details ?? "",
  });
}
