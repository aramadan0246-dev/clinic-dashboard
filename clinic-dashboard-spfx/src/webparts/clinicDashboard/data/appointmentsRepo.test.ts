import { cycleApptStatus } from "./appointmentsRepo";

test("cycleApptStatus cycles Upcoming -> InProgress -> Completed -> Upcoming", () => {
  expect(cycleApptStatus("Upcoming")).toBe("InProgress");
  expect(cycleApptStatus("InProgress")).toBe("Completed");
  expect(cycleApptStatus("Completed")).toBe("Upcoming");
});

test("cycleApptStatus leaves Cancelled unchanged (cancellation is terminal)", () => {
  expect(cycleApptStatus("Cancelled")).toBe("Cancelled");
});
