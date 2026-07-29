// src/webparts/clinicDashboard/data/staffRolesRepo.ts
import { getSP } from "./pnpConfig";
import { LIST_NAMES } from "./listNames";
import { IStaffRole, StaffRoleName } from "./models";

interface IStaffRoleListItem {
  Id: number;
  Person: { Title: string; Name: string } | null;
  Role: StaffRoleName;
  DepartmentId: number | null;
  DoctorId: number | null;
}

function toStaffRole(item: IStaffRoleListItem): IStaffRole {
  return {
    id: item.Id,
    // SharePoint's User Information List exposes the claims-encoded login name via "Name",
    // not "LoginName" (which isn't a selectable REST property on Person fields).
    userLoginName: item.Person?.Name ?? "",
    userDisplayName: item.Person?.Title ?? "",
    role: item.Role,
    departmentServiceId: item.DepartmentId,
    doctorId: item.DoctorId,
  };
}

export async function getAllStaffRoles(): Promise<IStaffRole[]> {
  const sp = getSP();
  const items: IStaffRoleListItem[] = [];
  const query = sp.web.lists
    .getByTitle(LIST_NAMES.StaffRoles)
    .items.select("Id", "Person/Title", "Person/Name", "Role", "DepartmentId", "DoctorId")
    .expand("Person");
  for await (const page of query) {
    items.push(...(page as IStaffRoleListItem[]));
  }
  return items.map(toStaffRole);
}

function normalizeLoginName(loginName: string): string {
  // Compare on the identity tail only (email/UPN), not the full string - some
  // environments hand back a claims-encoded login ("i:0#.f|membership|user@tenant.com")
  // and others a bare UPN ("user@tenant.com") for the exact same person, depending on
  // whether it came from context.pageContext.user.loginName or a Person field's "Name".
  const trimmed = loginName.trim();
  const tail = trimmed.includes("|") ? trimmed.slice(trimmed.lastIndexOf("|") + 1) : trimmed;
  return tail.toLowerCase();
}

export function findRoleForUser(loginName: string, roles: IStaffRole[]): IStaffRole | undefined {
  const target = normalizeLoginName(loginName);
  return roles.find((r) => normalizeLoginName(r.userLoginName) === target);
}
