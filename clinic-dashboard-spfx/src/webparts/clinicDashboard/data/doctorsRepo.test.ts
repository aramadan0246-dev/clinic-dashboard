import { cycleDoctorStatus, computeNextSlot } from "./doctorsRepo";

test("cycleDoctorStatus cycles Available -> Busy -> OffDuty -> Available", () => {
  expect(cycleDoctorStatus("Available")).toBe("Busy");
  expect(cycleDoctorStatus("Busy")).toBe("OffDuty");
  expect(cycleDoctorStatus("OffDuty")).toBe("Available");
});

test("computeNextSlot returns 'No upcoming slots' when doctor has no future appointments", () => {
  const result = computeNextSlot(1, []);
  expect(result).toBe("No upcoming slots");
});

test("computeNextSlot ignores cancelled and other doctors' appointments", () => {
  const now = Date.now();
  const inTwoHours = new Date(now + 2 * 60 * 60 * 1000).toISOString();
  const appts = [
    { doctorId: 1, apptDateTime: inTwoHours, status: "Cancelled" },
    { doctorId: 2, apptDateTime: inTwoHours, status: "Upcoming" },
  ];
  expect(computeNextSlot(1, appts)).toBe("No upcoming slots");
});

test("computeNextSlot returns 'Now' when the next appointment is within 15 minutes", () => {
  const now = Date.now();
  const inFiveMinutes = new Date(now + 5 * 60 * 1000).toISOString();
  const appts = [{ doctorId: 1, apptDateTime: inFiveMinutes, status: "Upcoming" }];
  expect(computeNextSlot(1, appts)).toBe("Now");
});
