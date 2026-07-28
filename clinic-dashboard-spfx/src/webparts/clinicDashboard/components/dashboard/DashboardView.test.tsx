import * as React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardView } from "./DashboardView";

test("DashboardView renders the four stat cards and the ward pulse label", () => {
  render(
    <DashboardView
      doctors={[]}
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
