// Ambient matcher declaration for @testing-library/jest-dom, which ships no
// TypeScript types of its own (and no @types/testing-library__jest-dom package
// is installed in this project). Without this, `tsc --noEmit` fails on
// `toBeInTheDocument()` even though the matcher is registered at runtime via
// jest.setup.js's `require("@testing-library/jest-dom")`. Scoped narrowly to
// just the matcher this module's tests use.
export {};

declare global {
  namespace jest {
    interface Matchers<R, T = object> {
      toBeInTheDocument(): R;
    }
  }
}
