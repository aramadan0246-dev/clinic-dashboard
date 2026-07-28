// Mock for @pnp/sp and its submodules
const mockSpfi = jest.fn(() => ({
  using: jest.fn((behavior) => {
    return mockSpfi.mock.results[mockSpfi.mock.calls.length - 1]?.value || {};
  }),
}));

module.exports = {
  spfi: mockSpfi,
  SPFI: class {},
  SPFx: jest.fn((context) => ({})),
};
