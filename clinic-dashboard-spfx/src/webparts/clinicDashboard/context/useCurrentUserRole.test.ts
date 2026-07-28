// src/webparts/clinicDashboard/context/useCurrentUserRole.test.ts
import { renderHook } from "@testing-library/react-hooks";
import { useCurrentUserRole } from "./useCurrentUserRole";
import { IStaffRole } from "../data/models";

const roles: IStaffRole[] = [
  {
    id: 1,
    userLoginName: "i:0#.f|membership|doc@contoso.com",
    userDisplayName: "Dr. Amara Okafor",
    role: "Physician",
    departmentServiceId: null,
    doctorId: 42,
  },
];

test("useCurrentUserRole resolves role and doctorId for a matched login", () => {
  const { result } = renderHook(() =>
    useCurrentUserRole("i:0#.f|membership|doc@contoso.com", roles)
  );
  expect(result.current.role).toBe("Physician");
  expect(result.current.doctorId).toBe(42);
  expect(result.current.departmentServiceId).toBeNull();
});

test("useCurrentUserRole returns undefined role for an unmatched login (read-only default)", () => {
  const { result } = renderHook(() =>
    useCurrentUserRole("i:0#.f|membership|stranger@contoso.com", roles)
  );
  expect(result.current.role).toBeUndefined();
});
