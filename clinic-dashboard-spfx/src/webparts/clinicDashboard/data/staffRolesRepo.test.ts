// src/webparts/clinicDashboard/data/staffRolesRepo.test.ts
import { findRoleForUser } from "./staffRolesRepo";
import { IStaffRole } from "./models";

const roles: IStaffRole[] = [
  {
    id: 1,
    userLoginName: "i:0#.f|membership|nurse@contoso.com",
    userDisplayName: "Nadia Hussain",
    role: "ChargeNurse",
    departmentServiceId: null,
    doctorId: null,
  },
];

test("findRoleForUser matches on exact login name", () => {
  expect(findRoleForUser("i:0#.f|membership|nurse@contoso.com", roles)).toBe(roles[0]);
});

test("findRoleForUser returns undefined when no match (defaults to read-only downstream)", () => {
  expect(findRoleForUser("i:0#.f|membership|unknown@contoso.com", roles)).toBeUndefined();
});

test("findRoleForUser matches regardless of casing or surrounding whitespace", () => {
  expect(findRoleForUser(" I:0#.F|MEMBERSHIP|Nurse@Contoso.com ", roles)).toBe(roles[0]);
});

test("findRoleForUser matches a bare UPN against a claims-encoded StaffRoles login", () => {
  // context.pageContext.user.loginName can come back as a bare UPN on some tenants,
  // while the StaffRoles Person field's "Name" is claims-encoded - same person, different shape.
  expect(findRoleForUser("nurse@contoso.com", roles)).toBe(roles[0]);
});

test("findRoleForUser matches a claims-encoded login against a bare-UPN StaffRoles login", () => {
  const bareRoles: IStaffRole[] = [{ ...roles[0], userLoginName: "nurse@contoso.com" }];
  expect(findRoleForUser("i:0#.f|membership|nurse@contoso.com", bareRoles)).toBe(bareRoles[0]);
});
