import * as React from "react";
import { render, screen } from "@testing-library/react";
import { NewsPanel } from "./NewsPanel";
import { IPermissions } from "../../context/usePermissions";

const item = {
  id: 1, title: "New triage protocol goes live Monday", category: "Policy" as const,
  excerpt: "Updated ESI-based triage scoring rolls out clinic-wide.", body: "Full body text.",
  createdDate: new Date().toISOString(), author: "Comms Team",
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

test("delete and publish controls hidden without canManageNews", () => {
  render(
    <NewsPanel news={[item]} expanded={null} setExpanded={jest.fn()} onDelete={jest.fn()} query=""
      onNew={jest.fn()} permissions={perms({ canManageNews: false })} />
  );
  expect(screen.queryByTitle("Delete announcement")).not.toBeInTheDocument();
  expect(screen.queryByText("New announcement")).not.toBeInTheDocument();
});

test("delete and publish controls shown with canManageNews", () => {
  render(
    <NewsPanel news={[item]} expanded={null} setExpanded={jest.fn()} onDelete={jest.fn()} query=""
      onNew={jest.fn()} permissions={perms({ canManageNews: true })} />
  );
  expect(screen.getByTitle("Delete announcement")).toBeInTheDocument();
  expect(screen.getByText("New announcement")).toBeInTheDocument();
});
