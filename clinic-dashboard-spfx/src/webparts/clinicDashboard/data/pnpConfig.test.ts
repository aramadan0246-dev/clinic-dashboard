import { getSP, initPnp } from "./pnpConfig";

test("getSP throws a clear error if initPnp was never called", () => {
  expect(() => getSP()).toThrow("PnPjs has not been initialized. Call initPnp(context) first.");
});

test("initPnp returns a truthy SPFI instance and getSP returns the same instance afterward", () => {
  const fakeContext = { pageContext: {}, msGraphClientFactory: undefined } as any;
  const sp = initPnp(fakeContext);
  expect(sp).toBeTruthy();
  expect(getSP()).toBe(sp);
});
