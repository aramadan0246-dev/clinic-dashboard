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
