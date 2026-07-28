import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddAppointmentForm } from "./AddAppointmentForm";
import { combineTodayWithTime } from "./AddAppointmentForm";

test("combineTodayWithTime builds an ISO string using today's date and the given HH:mm", () => {
  const iso = combineTodayWithTime("14:30");
  const d = new Date(iso);
  const now = new Date();
  expect(d.getFullYear()).toBe(now.getFullYear());
  expect(d.getMonth()).toBe(now.getMonth());
  expect(d.getDate()).toBe(now.getDate());
  expect(d.getHours()).toBe(14);
  expect(d.getMinutes()).toBe(30);
});

test("AddAppointmentForm calls onSubmit with a doctorId and ISO apptDateTime when Schedule is clicked", () => {
  const onSubmit = jest.fn();
  const doctors = [{ id: 1, name: "Dr. Sofia Bianchi", specialty: "Internal Medicine", room: "108", status: "Available" as const }];
  render(<AddAppointmentForm doctors={doctors} onSubmit={onSubmit} onClose={jest.fn()} />);
  fireEvent.change(screen.getByPlaceholderText("e.g. Jordan Ellis"), { target: { value: "Jordan Ellis" } });
  fireEvent.click(screen.getByText("Schedule appointment"));
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ patientName: "Jordan Ellis", doctorId: 1, visitType: "General visit", room: "—" })
  );
});
