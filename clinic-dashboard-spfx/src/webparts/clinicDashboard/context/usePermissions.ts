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
    const isAdmin = role === "ClinicalOperationsDirector";
    const isChargeNurse = role === "ChargeNurse";
    const isPhysician = role === "Physician";
    const isFrontDesk = role === "FrontDeskCoordinator";
    const isDeptLead = role === "DepartmentLead";
    const isComms = role === "CommunicationsStaff";

    return {
      canAddPatient: isAdmin || isChargeNurse || isFrontDesk,
      canDischargePatient: isAdmin || isChargeNurse,
      canAdmitAsUrgent: isAdmin || isChargeNurse,
      canReassignPhysician: (patientDoctorId) =>
        isAdmin || isChargeNurse || (isPhysician && patientDoctorId === doctorId),
      canAddDoctor: isAdmin || isChargeNurse,
      canRemoveDoctor: isAdmin || isChargeNurse,
      canToggleDoctorStatus: (targetDoctorId) =>
        isAdmin || isChargeNurse || (isPhysician && targetDoctorId === doctorId),
      canBookAppointment: isAdmin || isChargeNurse || isFrontDesk,
      canCancelAppointment: isAdmin || isChargeNurse || isFrontDesk,
      canProgressAppointmentStatus: isAdmin || isChargeNurse || isFrontDesk,
      canManageService: (serviceId) =>
        isAdmin || isChargeNurse || (isDeptLead && serviceId === departmentServiceId),
      canAddService: isAdmin || isChargeNurse,
      canManageNews: isAdmin || isComms,
    };
  }, [role, departmentServiceId, doctorId]);
}
