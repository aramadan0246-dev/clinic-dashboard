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
    if (!match && staffRoles.length > 0) {
      // eslint-disable-next-line no-console
      console.warn(
        "useCurrentUserRole: no StaffRoles row matched the current user - defaulting to read-only.",
        {
          currentUserLoginName,
          knownStaffRoleLoginNames: staffRoles.map((r) => r.userLoginName),
        }
      );
    }
    return {
      role: match?.role,
      departmentServiceId: match?.departmentServiceId ?? null,
      doctorId: match?.doctorId ?? null,
    };
  }, [currentUserLoginName, staffRoles]);
}
