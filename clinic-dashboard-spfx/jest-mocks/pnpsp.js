// Mock for @pnp/sp and its submodules
const mockSpfi = jest.fn(() => ({
  using: jest.fn(function () {
    return this;
  }),
}));

module.exports = {
  spfi: mockSpfi,
  SPFI: class {},
  SPFx: jest.fn((context) => ({})),
};
