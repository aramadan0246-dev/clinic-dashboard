import * as React from "react";
import { render, screen } from "@testing-library/react";
import { ServicesStrip } from "./ServicesStrip";
import { IPermissions } from "../../context/usePermissions";

const services = [
  { id: 3, name: "Pharmacy", description: "Prescriptions & refills", icon: "Pharmacy" as const, status: "Open" as const, queue: 6 },
  { id: 4, name: "Laboratory", description: "Blood work", icon: "Lab" as const, status: "Open" as const, queue: 4 },
];

function perms(overrides: Partial<IPermissions>): IPermissions {
  return {
    canAddPatient: false, canDischargePatient: false, canAdmitAsUrgent: false,
    canReassignPhysician: () => false, canAddDoctor: false, canRemoveDoctor: false,
    canToggleDoctorStatus: () => false, canBookAppointment: false, canCancelAppointment: false,
    canProgressAppointmentStatus: false, canManageService: () => false, canAddService: false,
    canManageNews: false, ...overrides,
  };
}

test("Call next is disabled for a service the department lead doesn't own", () => {
  render(
    <ServicesStrip services={services} query="" onCallNext={jest.fn()} onToggleStatus={jest.fn()}
      permissions={perms({ canManageService: (id) => id === 3 })} />
  );
  const pharmacyCard = screen.getByText("Pharmacy").closest("div")!.parentElement!;
  const labCard = screen.getByText("Laboratory").closest("div")!.parentElement!;
  expect(pharmacyCard.querySelector("button[disabled]")).toBeNull();
  expect(labCard.querySelectorAll("button")[1]).toBeDisabled();
});
