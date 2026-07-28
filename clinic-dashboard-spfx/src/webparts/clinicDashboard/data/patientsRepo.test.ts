import { generateMrn, computeWaitLabel, isUrgent } from "./patientsRepo";

test("generateMrn produces the MRN-##### shape", () => {
  const mrn = generateMrn();
  expect(mrn).toMatch(/^MRN-\d{5}$/);
});

test("isUrgent is true for all four urgent severities and false for Waiting/Discharged", () => {
  expect(isUrgent("UrgentCritical")).toBe(true);
  expect(isUrgent("UrgentHigh")).toBe(true);
  expect(isUrgent("UrgentModerate")).toBe(true);
  expect(isUrgent("UrgentLow")).toBe(true);
  expect(isUrgent("Waiting")).toBe(false);
  expect(isUrgent("Discharged")).toBe(false);
});

test("computeWaitLabel formats minutes for a recent flaggedAt", () => {
  const ninetySecondsAgo = new Date(Date.now() - 90 * 1000).toISOString();
  expect(computeWaitLabel(ninetySecondsAgo)).toBe("1 min");
});

test("computeWaitLabel formats zero minutes as '0 min'", () => {
  const justNow = new Date().toISOString();
  expect(computeWaitLabel(justNow)).toBe("0 min");
});
