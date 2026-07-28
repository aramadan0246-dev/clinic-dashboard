import * as React from "react";
import { render, screen } from "@testing-library/react";
import { DoctorsView } from "./DoctorsView";
import { IPermissions } from "../../context/usePermissions";

const doctor = { id: 1, name: "Dr. Amara Okafor", specialty: "Cardiology", room: "204", status: "Available" as const };

function perms(overrides: Partial<IPermissions>): IPermissions {
  return {
    canAddPatient: false, canDischargePatient: false, canAdmitAsUrgent: false,
    canReassignPhysician: () => false, canAddDoctor: false, canRemoveDoctor: false,
    canToggleDoctorStatus: () => false, canBookAppointment: false, canCancelAppointment: false,
    canProgressAppointmentStatus: false, canManageService: () => false, canAddService: false,
    canManageNews: false, ...overrides,
  };
}

test("Add doctor button hidden without canAddDoctor", () => {
  render(
    <DoctorsView doctors={[doctor]} appts={[]} query="" onToggle={jest.fn()} onSelect={jest.fn()}
      onNew={jest.fn()} permissions={perms({ canAddDoctor: false })} />
  );
  expect(screen.queryByText("Add doctor")).not.toBeInTheDocument();
});

test("Add doctor button shown with canAddDoctor", () => {
  render(
    <DoctorsView doctors={[doctor]} appts={[]} query="" onToggle={jest.fn()} onSelect={jest.fn()}
      onNew={jest.fn()} permissions={perms({ canAddDoctor: true })} />
  );
  expect(screen.getByText("Add doctor")).toBeInTheDocument();
});
