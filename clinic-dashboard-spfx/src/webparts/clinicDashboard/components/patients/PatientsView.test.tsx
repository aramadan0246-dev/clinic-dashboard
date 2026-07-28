import * as React from "react";
import { render, screen } from "@testing-library/react";
import { PatientsView } from "./PatientsView";
import { IPermissions } from "../../context/usePermissions";

const patient = {
  id: 1, name: "Harold Whitfield", mrn: "MRN-88214", age: 67, status: "UrgentCritical" as const,
  reasonForVisit: "Chest pain", assignedDoctorId: 1, assignedDoctorName: "Dr. Amara Okafor",
  flaggedAt: new Date().toISOString(), heartRate: 112, bloodPressure: "162/98", spo2: "94%",
  clinicalNotes: "Troponin pending.", lastVisit: new Date().toISOString(),
};

function perms(overrides: Partial<IPermissions>): IPermissions {
  return {
    canAddPatient: false, canDischargePatient: false, canAdmitAsUrgent: false,
    canReassignPhysician: () => false, canAddDoctor: false, canRemoveDoctor: false,
    canToggleDoctorStatus: () => false, canBookAppointment: false, canCancelAppointment: false,
    canProgressAppointmentStatus: false, canManageService: () => false, canAddService: false,
    canManageNews: false, ...overrides,
  };
}

test("Add patient button is hidden when the user lacks canAddPatient", () => {
  render(
    <PatientsView
      urgentCases={[patient]} roster={[]} doctors={[]} query=""
      onSelectPatient={jest.fn()} onNewPatient={jest.fn()} onAdmit={jest.fn()} onDischargeRoster={jest.fn()}
      permissions={perms({ canAddPatient: false })}
    />
  );
  expect(screen.queryByText("Add patient")).not.toBeInTheDocument();
});

test("Add patient button is shown when the user has canAddPatient", () => {
  render(
    <PatientsView
      urgentCases={[patient]} roster={[]} doctors={[]} query=""
      onSelectPatient={jest.fn()} onNewPatient={jest.fn()} onAdmit={jest.fn()} onDischargeRoster={jest.fn()}
      permissions={perms({ canAddPatient: true })}
    />
  );
  expect(screen.getByText("Add patient")).toBeInTheDocument();
});
