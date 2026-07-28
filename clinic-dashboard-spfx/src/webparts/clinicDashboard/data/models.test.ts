import { URGENT_STATUSES, PatientStatus } from "./models";

test("URGENT_STATUSES contains exactly the four urgent severities, no Waiting/Discharged", () => {
  const expected: PatientStatus[] = [
    "UrgentCritical",
    "UrgentHigh",
    "UrgentModerate",
    "UrgentLow",
  ];
  expect(URGENT_STATUSES.sort()).toEqual(expected.sort());
  expect(URGENT_STATUSES).not.toContain("Waiting");
  expect(URGENT_STATUSES).not.toContain("Discharged");
});
