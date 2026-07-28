import { matches } from "./tokens";

test("matches is case-insensitive and checks all provided fields", () => {
  expect(matches("okafor", "Dr. Amara Okafor", "Cardiology")).toBe(true);
  expect(matches("cardio", "Dr. Amara Okafor", "Cardiology")).toBe(true);
  expect(matches("dermatology", "Dr. Amara Okafor", "Cardiology")).toBe(false);
});

test("matches with an empty query always returns true", () => {
  expect(matches("", "anything")).toBe(true);
});
