import { useMemo } from "react";
import { ICurrentUserRole } from "./useCurrentUserRole";

export interface IPermissions {
  canAddPatient: boolean;
  canDischargePatient: boolean;
  canAdmitAsUrgent: boolean;
  canReassignPhysician: (patientDoctorId: number | null, patientDoctorName: string) => boolean;
  canAddDoctor: boolean;
  canRemoveDoctor: boolean;
  canToggleDoctorStatus: (doctorId: number) => boolean;
  canBookAppointment: boolean;
  canCancelAppointment: boolean;
  canProgressAppointmentStatus: boolean;
  canManageService: (serviceId: number) => boolean;
  canAddService: boolean;
  canManageNews: boolean;
}

export function usePermissions(currentUserRole: ICurrentUserRole): IPermissions {
  const { role, departmentServiceId, doctorId } = currentUserRole;

  return useMemo<IPermissions>(() => {
    const isChargeNurse = role === "ChargeNurse";
    const isPhysician = role === "Physician";
    const isFrontDesk = role === "FrontDeskCoordinator";
    const isDeptLead = role === "DepartmentLead";
    const isComms = role === "CommunicationsStaff";

    return {
      canAddPatient: isChargeNurse || isFrontDesk,
      canDischargePatient: isChargeNurse,
      canAdmitAsUrgent: isChargeNurse,
      canReassignPhysician: (patientDoctorId) =>
        isChargeNurse || (isPhysician && patientDoctorId === doctorId),
      canAddDoctor: isChargeNurse,
      canRemoveDoctor: isChargeNurse,
      canToggleDoctorStatus: (targetDoctorId) =>
        isChargeNurse || (isPhysician && targetDoctorId === doctorId),
      canBookAppointment: isChargeNurse || isFrontDesk,
      canCancelAppointment: isChargeNurse || isFrontDesk,
      canProgressAppointmentStatus: isChargeNurse || isFrontDesk,
      canManageService: (serviceId) =>
        isChargeNurse || (isDeptLead && serviceId === departmentServiceId),
      canAddService: isChargeNurse,
      canManageNews: isComms,
    };
  }, [role, departmentServiceId, doctorId]);
}
