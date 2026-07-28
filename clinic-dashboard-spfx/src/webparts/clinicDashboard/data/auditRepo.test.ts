import { buildAuditTitle } from "./auditRepo";

test("buildAuditTitle renders a short human-readable label", () => {
  expect(buildAuditTitle("PatientDischarged", "Harold Whitfield")).toBe(
    "Discharge: Harold Whitfield"
  );
  expect(buildAuditTitle("AppointmentCancelled", "Fatima Zahra")).toBe(
    "Cancel appointment: Fatima Zahra"
  );
});
