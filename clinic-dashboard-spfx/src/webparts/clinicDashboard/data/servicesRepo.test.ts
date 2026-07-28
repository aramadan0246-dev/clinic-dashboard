import { flipServiceStatus, decrementQueue } from "./servicesRepo";

test("flipServiceStatus swaps Open and Closed", () => {
  expect(flipServiceStatus("Open")).toBe("Closed");
  expect(flipServiceStatus("Closed")).toBe("Open");
});

test("decrementQueue never goes below zero", () => {
  expect(decrementQueue(3)).toBe(2);
  expect(decrementQueue(0)).toBe(0);
});
