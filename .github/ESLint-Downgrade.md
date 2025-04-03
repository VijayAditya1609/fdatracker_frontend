# ESLint Downgrade Documentation

This document explains the downgrade from ESLint v9 to ESLint v8 that was performed to resolve dependency conflicts.

## Background

The project was encountering a dependency conflict between ESLint v9 and eslint-plugin-sonarjs:

```
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error
npm error While resolving: @VijayAditya1609/fdatracker-frontend@0.1.1-dev.202504020935
npm error Found: eslint@9.23.0
npm error node_modules/eslint
npm error   dev eslint@"^9.9.1" from the root project
npm error
npm error Could not resolve dependency:
npm error peer eslint@"^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0" from eslint-plugin-sonarjs@0.24.0
npm error node_modules/eslint-plugin-sonarjs
npm error   dev eslint-plugin-sonarjs@"^0.24.0" from the root project
```

The issue is that eslint-plugin-sonarjs@0.24.0 only supports ESLint versions up to v8, but the project was using ESLint v9.

## Changes Made

1. **Downgraded ESLint**:
   - Changed ESLint from v9.9.1 to v8.56.0 (latest v8 release)

2. **Updated TypeScript ESLint Packages**:
   - Changed @typescript-eslint/eslint-plugin from v7.0.0 to v6.21.0
   - Changed @typescript-eslint/parser from v7.0.0 to v6.21.0

3. **Updated React Hooks Plugin**:
   - Changed eslint-plugin-react-hooks from v5.1.0-rc.0 to v4.6.0

4. **Updated React Refresh Plugin**:
   - Changed eslint-plugin-react-refresh from v0.4.11 to v0.4.5

5. **Removed ESLint v9 Specific Dependencies**:
   - Removed @eslint/js (only used with ESLint v9)

6. **Configuration Format Change**:
   - Created a new .eslintrc.js file using the older configuration format compatible with ESLint v8
   - Kept the original eslint.config.js file for reference (ESLint v9 format)

## Benefits

- Resolves the dependency conflict with eslint-plugin-sonarjs
- Allows npm install/ci to complete successfully
- Maintains all the same linting rules and functionality

## Future Considerations

Once eslint-plugin-sonarjs is updated to support ESLint v9, the project can be upgraded back to ESLint v9 by:

1. Updating the ESLint version in package.json
2. Reinstating the @eslint/js dependency
3. Switching back to using the eslint.config.js file
4. Updating the TypeScript ESLint packages to v7+
5. Updating the React Hooks plugin to v5+

## Workflow Compatibility

The GitHub Actions workflows already had conditional logic to handle both ESLint v9 (with flat config) and older ESLint versions (with .eslintrc), so no changes were needed to the workflow files.
