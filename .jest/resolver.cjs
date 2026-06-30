/**
 * Custom resolver that maps .js imports to .ts files for source files,
 * but leaves node_modules imports alone (prevents moduleNameMapper
 * from hijacking a package's internal relative imports).
 *
 * Also adds "import" to the export conditions as a fallback so that
 * ESM-only packages (whose exports field only has an "import" condition)
 * can be resolved and then transformed by Babel.
 * Packages that have a "require" condition (e.g. synckit) are resolved
 * normally without the fallback, keeping their CJS entry.
 */

module.exports = (request, options) => {
  const { basedir, defaultResolver } = options;

  const conditionsWithImport = {
    ...options,
    conditions: [...new Set([...(options.conditions ?? []), "import"])],
  };

  // For imports from within node_modules, skip any .js→.ts remapping.
  // Try the default conditions first so packages that ship both CJS and ESM
  // (like synckit) stay on their CJS entry. Fall back to "import" condition
  // for packages that are ESM-only (like @actions/http-client).
  if (basedir && basedir.includes("/node_modules/")) {
    try {
      return defaultResolver(request, options);
    } catch {
      return defaultResolver(request, conditionsWithImport);
    }
  }

  // For relative .js imports from src/, try resolving as .ts first
  if (request.match(/^\.\.?\//)) {
    const tsRequest = request.replace(/\.js$/, ".ts");
    if (tsRequest !== request) {
      try {
        return defaultResolver(tsRequest, conditionsWithImport);
      } catch {
        // fall through to default resolution
      }
    }
  }

  return defaultResolver(request, conditionsWithImport);
};
