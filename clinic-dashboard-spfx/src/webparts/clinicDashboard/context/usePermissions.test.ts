import { renderHook } from "@testing-library/react-hooks";
import { usePermissions } from "./usePermissions";
import { ICurrentUserRole } from "./useCurrentUserRole";

function role(overrides: Partial<ICurrentUserRole>): ICurrentUserRole {
  return { role: undefined, departmentServiceId: null, doctorId: null, ...overrides };
}

test("ChargeNurse can do everything except manage services/news", () => {
  const { result } = renderHook(() => usePermissions(role({ role: "ChargeNurse" })));
  const p = result.current;
  expect(p.canAddPatient).toBe(true);
  expect(p.canDischargePatient).toBe(true);
  expect(p.canAdmitAsUrgent).toBe(true);
  expect(p.canAddDoctor).toBe(true);
  expect(p.canRemoveDoctor).toBe(true);
  expect(p.canBookAppointment).toBe(true);
  expect(p.canCancelAppointment).toBe(true);
  expect(p.canAddService).toBe(true);
  expect(p.canManageNews).toBe(false);
  expect(p.canReassignPhysician(999, "Dr. Anyone")).toBe(true);
  expect(p.canToggleDoctorStatus(999)).toBe(true);
});

test("Physician can only reassign own cases and toggle own doctor status", () => {
  const { result } = renderHook(() =>
    usePermissions(role({ role: "Physician", doctorId: 42 }))
  );
  const p = result.current;
  expect(p.canAddPatient).toBe(false);
  expect(p.canDischargePatient).toBe(false);
  expect(p.canReassignPhysician(42, "Dr. Amara Okafor")).toBe(true);
  expect(p.canReassignPhysician(7, "Dr. Someone Else")).toBe(false);
  expect(p.canToggleDoctorStatus(42)).toBe(true);
  expect(p.canToggleDoctorStatus(7)).toBe(false);
});

test("FrontDeskCoordinator can add patients and manage appointments only", () => {
  const { result } = renderHook(() =>
    usePermissions(role({ role: "FrontDeskCoordinator" }))
  );
  const p = result.current;
  expect(p.canAddPatient).toBe(true);
  expect(p.canBookAppointment).toBe(true);
  expect(p.canCancelAppointment).toBe(true);
  expect(p.canDischargePatient).toBe(false);
  expect(p.canAddDoctor).toBe(false);
});

test("DepartmentLead can only manage their own service", () => {
  const { result } = renderHook(() =>
    usePermissions(role({ role: "DepartmentLead", departmentServiceId: 3 }))
  );
  const p = result.current;
  expect(p.canManageService(3)).toBe(true);
  expect(p.canManageService(4)).toBe(false);
  expect(p.canAddService).toBe(false);
});

test("CommunicationsStaff can only manage news", () => {
  const { result } = renderHook(() =>
    usePermissions(role({ role: "CommunicationsStaff" }))
  );
  expect(result.current.canManageNews).toBe(true);
  expect(result.current.canAddPatient).toBe(false);
});

test("unmatched users are read-only", () => {
  const { result } = renderHook(() => usePermissions(role({ role: undefined })));
  const p = result.current;
  expect(p.canAddPatient).toBe(false);
  expect(p.canDischargePatient).toBe(false);
  expect(p.canAddDoctor).toBe(false);
  expect(p.canBookAppointment).toBe(false);
  expect(p.canAddService).toBe(false);
  expect(p.canManageNews).toBe(false);
  expect(p.canReassignPhysician(999, "Dr. Anyone")).toBe(false);
  expect(p.canToggleDoctorStatus(999)).toBe(false);
  expect(p.canManageService(1)).toBe(false);
});

test("ClinicalOperationsDirector is a full admin with access to everything", () => {
  const { result } = renderHook(() =>
    usePermissions(role({ role: "ClinicalOperationsDirector" }))
  );
  const p = result.current;
  expect(p.canAddPatient).toBe(true);
  expect(p.canDischargePatient).toBe(true);
  expect(p.canAdmitAsUrgent).toBe(true);
  expect(p.canAddDoctor).toBe(true);
  expect(p.canRemoveDoctor).toBe(true);
  expect(p.canBookAppointment).toBe(true);
  expect(p.canCancelAppointment).toBe(true);
  expect(p.canProgressAppointmentStatus).toBe(true);
  expect(p.canAddService).toBe(true);
  expect(p.canManageNews).toBe(true);
  // Function-based permissions are unconditional for admin, unlike ChargeNurse
  // (which also passes every id) or Physician/DepartmentLead (which don't).
  expect(p.canReassignPhysician(999, "Dr. Anyone")).toBe(true);
  expect(p.canToggleDoctorStatus(999)).toBe(true);
  expect(p.canManageService(999)).toBe(true);
});
