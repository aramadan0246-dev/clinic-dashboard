// src/webparts/clinicDashboard/context/useCurrentUserRole.ts
import { useMemo } from "react";
import { IStaffRole, StaffRoleName } from "../data/models";
import { findRoleForUser } from "../data/staffRolesRepo";

export interface ICurrentUserRole {
  role: StaffRoleName | undefined;
  departmentServiceId: number | null;
  doctorId: number | null;
}

export function useCurrentUserRole(
  currentUserLoginName: string,
  staffRoles: IStaffRole[]
): ICurrentUserRole {
  return useMemo(() => {
    const match = findRoleForUser(currentUserLoginName, staffRoles);
    return {
      role: match?.role,
      departmentServiceId: match?.departmentServiceId ?? null,
      doctorId: match?.doctorId ?? null,
    };
  }, [currentUserLoginName, staffRoles]);
}
