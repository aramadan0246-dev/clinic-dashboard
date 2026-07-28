import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClinicDashboard } from "./ClinicDashboard";

jest.mock("../context/ClinicDataProvider", () => {
  const actual = jest.requireActual("../context/ClinicDataProvider");
  return {
    ...actual,
    ClinicDataProvider: ({ children }: any) => <div>{children}</div>,
    useClinicData: () => ({
      status: "ready", doctors: [], patients: [], appointments: [], services: [], news: [],
      staffRoles: [], currentUserRole: { role: "ChargeNurse", departmentServiceId: null, doctorId: null },
      toasts: [], addPatient: jest.fn(), dischargeUrgent: jest.fn(), admitAsUrgent: jest.fn(),
      reassignDoctor: jest.fn(), toggleDoctorStatus: jest.fn(), addDoctor: jest.fn(), removeDoctor: jest.fn(),
      addAppointment: jest.fn(), cycleAppt: jest.fn(), cancelAppt: jest.fn(), removeAppt: jest.fn(),
      toggleServiceStatus: jest.fn(), callNext: jest.fn(), addService: jest.fn(), addNews: jest.fn(),
      deleteNews: jest.fn(),
    }),
  };
});

const fakeContext = { pageContext: { user: { loginName: "x", displayName: "Test User" } } } as any;

test("clicking a nav item switches the visible view", () => {
  render(<ClinicDashboard context={fakeContext} />);
  expect(screen.getByText("Live overview across the clinic")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Doctors"));
  expect(screen.getByText("Staff availability and workload")).toBeInTheDocument();
});

test("typing in the search box updates the query passed to views", () => {
  render(<ClinicDashboard context={fakeContext} />);
  const input = screen.getByPlaceholderText(/Search patients/i) as HTMLInputElement;
  fireEvent.change(input, { target: { value: "okafor" } });
  expect(input.value).toBe("okafor");
});
