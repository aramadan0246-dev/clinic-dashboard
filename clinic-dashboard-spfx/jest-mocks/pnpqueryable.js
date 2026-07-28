// Mock for @pnp/queryable and its submodules
// Queryable is only referenced for type/class-identity by other @pnp submodules; never instantiated meaningfully in tests
module.exports = {
  Queryable: class {},
};
