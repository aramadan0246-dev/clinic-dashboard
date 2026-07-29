import * as React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardView } from "./DashboardView";
import { IPatient } from "../../data/models";

test("DashboardView renders the four stat cards and the ward pulse label", () => {
  render(
    <DashboardView
      doctors={[]}
      patients={[]}
      urgentCases={[]}
      appts={[]}
      news={[]}
      services={[]}
      query=""
      onSelectPatient={jest.fn()}
      onSelectDoctor={jest.fn()}
    />
  );
  expect(screen.getByText("Ward pulse")).toBeInTheDocument();
  expect(screen.getByText("Patients today")).toBeInTheDocument();
  // "Urgent cases" is the stat card's label AND the composed UrgentCasesPanel's
  // section header, so it legitimately appears twice once the real panels are wired in.
  expect(screen.getAllByText("Urgent cases").length).toBeGreaterThan(0);
  expect(screen.getByText("Doctors available")).toBeInTheDocument();
  expect(screen.getByText("Appointments today")).toBeInTheDocument();
});

test("Patients today reflects the real patients list length, not a hardcoded number", () => {
  const patients: IPatient[] = [
    { id: 1, name: "A", mrn: "MRN-1", age: 30, status: "Waiting", reasonForVisit: "", assignedDoctorId: null, assignedDoctorName: "Unassigned", flaggedAt: new Date().toISOString(), heartRate: null, bloodPressure: "", spo2: "", clinicalNotes: "", lastVisit: new Date().toISOString() },
    { id: 2, name: "B", mrn: "MRN-2", age: 40, status: "Discharged", reasonForVisit: "", assignedDoctorId: null, assignedDoctorName: "Unassigned", flaggedAt: new Date().toISOString(), heartRate: null, bloodPressure: "", spo2: "", clinicalNotes: "", lastVisit: new Date().toISOString() },
  ];
  render(
    <DashboardView
      doctors={[]}
      patients={patients}
      urgentCases={[]}
      appts={[]}
      news={[]}
      services={[]}
      query=""
      onSelectPatient={jest.fn()}
      onSelectDoctor={jest.fn()}
    />
  );
  expect(screen.getByText("2")).toBeInTheDocument();
  expect(screen.queryByText("142")).not.toBeInTheDocument();
});
