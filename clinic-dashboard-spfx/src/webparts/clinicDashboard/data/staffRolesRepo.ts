// src/webparts/clinicDashboard/data/staffRolesRepo.ts
import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IStaffRole, StaffRoleName } from "./models";

interface IStaffRoleListItem {
  Id: number;
  Person: { Title: string; LoginName: string } | null;
  Role: StaffRoleName;
  DepartmentId: number | null;
  DoctorId: number | null;
}

function toStaffRole(item: IStaffRoleListItem): IStaffRole {
  return {
    id: item.Id,
    userLoginName: item.Person?.LoginName ?? "",
    userDisplayName: item.Person?.Title ?? "",
    role: item.Role,
    departmentServiceId: item.DepartmentId,
    doctorId: item.DoctorId,
  };
}

export async function getAllStaffRoles(): Promise<IStaffRole[]> {
  const sp = getSP();
  const items: IStaffRoleListItem[] = await sp.web.lists
    .getByTitle(LIST_NAMES.StaffRoles)
    .items.select("Id", "Person/Title", "Person/LoginName", "Role", "DepartmentId", "DoctorId")
    .expand("Person")
    .getAll();
  return items.map(toStaffRole);
}

export function findRoleForUser(loginName: string, roles: IStaffRole[]): IStaffRole | undefined {
  return roles.find((r) => r.userLoginName === loginName);
}
