import { formatNewsDate } from "./newsRepo";

test("formatNewsDate renders an ISO date as 'Mon DD' style", () => {
  const result = formatNewsDate("2026-07-25T09:00:00Z");
  expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
});
