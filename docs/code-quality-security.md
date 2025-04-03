# Code Quality and Security Checks

This document outlines the code quality and security checks implemented in our CI/CD pipeline.

## Overview

We have implemented three dedicated workflows for code quality and security:

1. **Code Quality Checks** - Static analysis, linting, formatting, and test coverage
2. **Security Analysis** - Dependency scanning, secret detection, and license compliance
3. **Performance & Accessibility** - Performance metrics, bundle size analysis, and accessibility testing

These workflows run independently from our deployment process, ensuring that code quality and security checks don't block deployments but still provide valuable feedback.

## Code Quality Checks

The code quality workflow (`code-quality.yml`) runs the following checks:

### ESLint with Stricter Rules

We've enhanced our ESLint configuration with:

- **React Hooks Rules** - Ensures proper usage of React hooks, including the exhaustive-deps rule
- **Import Rules** - Enforces consistent import ordering and prevents circular dependencies
- **Complexity Rules** - Limits cyclomatic and cognitive complexity of functions
- **SonarJS Rules** - Detects code smells and potential bugs
- **JSX Accessibility Rules** - Ensures accessibility best practices in React components

To run locally:
```bash
npm run lint
```

For complexity analysis:
```bash
npm run lint:complexity
```

### TypeScript Type Checking

Verifies type safety across the codebase.

To run locally:
```bash
npm run type-check
```

### Code Duplication Detection

Uses jscpd to identify duplicated code that should be refactored.

To run locally:
```bash
npm run lint:duplication
```

### Test Coverage

Ensures adequate test coverage across the codebase with a minimum threshold of 80%.

To run locally:
```bash
npm run check:coverage
```

## Security Analysis

The security workflow (`security-analysis.yml`) runs the following checks:

### npm Audit

Scans dependencies for known vulnerabilities.

To run locally:
```bash
npm run security
```

### CodeQL Analysis

GitHub's semantic code analysis engine that identifies vulnerabilities and errors in your code.

### Secret Scanning with Gitleaks

Detects hardcoded secrets, credentials, and sensitive information in the codebase.

### License Compliance Checking

Ensures all dependencies have compatible licenses.

To run locally:
```bash
npm run security:licenses
```

## Performance & Accessibility

The performance and accessibility workflow (`performance-accessibility.yml`) runs the following checks:

### Lighthouse CI

Analyzes web performance, accessibility, progressive web apps, SEO, and more.

Key metrics monitored:
- Performance score (target: 80+)
- Accessibility score (target: 90+)
- Best practices score (target: 90+)
- SEO score (target: 90+)
- First Contentful Paint (target: < 2s)
- Time to Interactive (target: < 3.5s)
- Largest Contentful Paint (target: < 2.5s)

### Bundle Size Analysis

Monitors the size of JavaScript and CSS bundles to prevent performance regressions.

To run locally:
```bash
npm run bundlesize
```

### Accessibility Testing

Uses axe-core to identify accessibility issues.

To run locally:
```bash
npm run a11y
```

## Interpreting Results

### GitHub Actions Artifacts

Each workflow generates reports that are uploaded as artifacts:

1. **code-quality-reports** - Contains ESLint, test coverage, and duplication reports
2. **security-reports** - Contains npm audit, Gitleaks, and license compliance reports
3. **performance-accessibility-reports** - Contains Lighthouse, bundle size, and accessibility reports

### Common Issues and Fixes

#### ESLint Warnings/Errors

- **Missing dependencies in useEffect**: Add all variables used in the effect to the dependency array
- **Import ordering**: Follow the order: built-in modules, external modules, internal modules
- **Complexity issues**: Break down complex functions into smaller, more manageable pieces

#### Security Issues

- **Vulnerable dependencies**: Update to patched versions or find alternatives
- **Hardcoded secrets**: Move secrets to environment variables or secure storage
- **License issues**: Replace dependencies with incompatible licenses

#### Performance Issues

- **Large bundle size**: Split code into smaller chunks, lazy load components, remove unused dependencies
- **Slow rendering**: Optimize React components, use memoization, reduce re-renders
- **Accessibility issues**: Add proper ARIA attributes, ensure keyboard navigation works, provide text alternatives for images

## Quality Gates

Currently, most checks are set to continue on error, meaning they won't fail the build. This is to allow for a gradual adoption of these quality standards. In the future, we plan to make critical checks fail the build to enforce higher quality standards.

## Future Improvements

- Set up a code quality dashboard to track metrics over time
- Implement pre-commit hooks for local validation
- Add more specific performance budgets for critical pages
- Integrate with a code quality service like SonarQube or CodeClimate
