/**
 * Custom resolver that maps .js imports to .ts files for source files,
 * but leaves node_modules imports alone (prevents moduleNameMapper
 * from hijacking a package's internal relative imports).
 */

module.exports = (request, options) => {
  const { basedir, defaultResolver } = options;

  // For imports from within node_modules, skip any .js→.ts remapping
  if (basedir && basedir.includes("/node_modules/")) {
    return defaultResolver(request, options);
  }

  // For relative .js imports from src/, try resolving as .ts first
  if (request.match(/^\.\.?\//)) {
    const tsRequest = request.replace(/\.js$/, ".ts");
    if (tsRequest !== request) {
      try {
        return defaultResolver(tsRequest, options);
      } catch {
        // fall through to default resolution
      }
    }
  }

  return defaultResolver(request, options);
};
