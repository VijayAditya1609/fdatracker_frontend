# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration, deployment, and code quality checks.

## Workflows Overview

### 1. Development Release (`dev-release.yml`)

Automatically creates development releases when code is pushed to the `develop` branch.

**Triggers:**
- Push to `develop` branch
- Manual trigger with release type selection

**Features:**
- Automatic versioning based on commit messages or manual selection
- Human-readable date and time format (YYYY-MM-DD HH:MM) for development versions
- Changelog generation
- GitHub release creation
- Triggers package publishing for non-dev releases

### 2. Package Publishing (`publish-package.yml`)

Publishes the package to GitHub Packages.

**Triggers:**
- GitHub Release creation
- Manual trigger with version selection
- Repository dispatch event from the development release workflow

**Features:**
- Builds the package
- Publishes to GitHub Packages
- Supports different version types (patch, minor, major, prerelease)

### 3. Deploy to Development (`deploy-dev.yml`)

Deploys the application to the development environment.

**Triggers:**
- Push to `develop` branch
- Manual trigger with deployment message
- Scheduled runs (10:00 AM and 4:00 PM UTC)

**Features:**
- Builds the application
- Creates backups of existing deployments
- Deploys to development server via SSH
- Verifies deployment success

### 4. Code Quality Checks (`code-quality.yml`)

Runs code quality checks on the codebase.

**Triggers:**
- Push to `develop` branch only
- Pull requests to `develop` branch only
- Manual trigger
- Daily schedule (10:00 AM UTC)

**Checks:**
- ESLint with stricter rules
- Code complexity analysis
- Formatting checks
- Code duplication detection
- TypeScript type checking
- Test coverage reporting

**Reports:**
- Generates detailed HTML reports for each check
- Uploads reports as artifacts

### 5. Security Analysis (`security-analysis.yml`)

Performs security analysis on the codebase.

**Triggers:**
- Push to `develop` branch only
- Pull requests to `develop` branch only
- Weekly schedule (Sunday at midnight)
- Manual trigger

**Checks:**
- npm audit for dependency vulnerabilities
- CodeQL analysis for JavaScript/TypeScript
- Secret scanning with Gitleaks
- License compliance checking

**Reports:**
- Generates detailed security reports
- Uploads reports as artifacts

### 6. Performance & Accessibility (`performance-accessibility.yml`)

Analyzes performance and accessibility of the application.

**Triggers:**
- Push to `develop` branch only
- Pull requests to `develop` branch only
- Manual trigger

**Checks:**
- Lighthouse CI for performance metrics
- Bundle size analysis with source-map-explorer
- Accessibility testing with axe-core

**Reports:**
- Generates performance and accessibility reports
- Uploads reports as artifacts

## Configuration Files

- **lighthouse-config.json**: Configuration for Lighthouse CI
- **gitleaks.toml**: Rules for secret scanning with Gitleaks

## Running Workflows Manually

All workflows can be triggered manually from the GitHub Actions tab in the repository.

### Development Release

1. Go to Actions > Development Release
2. Click "Run workflow"
3. Select the release type (patch, minor, major, dev)
4. Click "Run workflow"

### Package Publishing

1. Go to Actions > Publish Package
2. Click "Run workflow"
3. Select the version type (patch, minor, major, prerelease)
4. Click "Run workflow"

### Code Quality, Security, and Performance

These workflows can be run without any parameters:

1. Go to Actions > [Workflow Name]
2. Click "Run workflow"
3. Select the branch
4. Click "Run workflow"

## Workflow Artifacts

Each workflow generates artifacts that can be downloaded from the GitHub Actions tab:

- **code-quality-reports**: ESLint, test coverage, and duplication reports
- **security-reports**: npm audit, Gitleaks, and license compliance reports
- **performance-accessibility-reports**: Lighthouse, bundle size, and accessibility reports

## Maintenance

### Adding New Checks

To add a new check to an existing workflow:

1. Add any required dependencies to `package.json`
2. Add a new step to the appropriate workflow file
3. Update the documentation in `docs/code-quality-security.md`

### Modifying Quality Gates

Currently, most checks are set to continue on error. To make a check fail the build:

1. Remove the `continue-on-error: true` line from the step
2. Consider adding a comment explaining why this check is critical

### Troubleshooting

If a workflow fails:

1. Check the workflow run logs in GitHub Actions
2. Download and examine the relevant artifacts
3. Try running the failing check locally using the corresponding npm script
4. Fix the issues and push the changes
