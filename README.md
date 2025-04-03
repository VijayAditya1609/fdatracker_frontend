# FDA Tracker Frontend

A comprehensive frontend application for tracking FDA inspections, observations, and compliance data.

## Overview

FDA Tracker Frontend is a React-based application that provides a complete solution for monitoring and analyzing FDA regulatory activities. It includes components for visualizing inspection data, Form 483 observations, warning letters, and more.

## Features

- **Dashboard**: Comprehensive overview of FDA regulatory activities
- **Form 483 Analysis**: Detailed analysis of Form 483 observations
- **Inspection Tracking**: Monitor and analyze FDA inspections
- **Investigator Profiles**: Track FDA investigators and their inspection history
- **Company Comparisons**: Compare regulatory performance across companies
- **Facility Mapping**: Visualize facilities and their inspection status
- **Advanced Filtering**: Filter data by various criteria
- **Responsive Design**: Works on desktop and mobile devices

## Code Quality & Security

We maintain high code quality and security standards through automated checks:

- **Code Quality**: ESLint with strict rules, TypeScript type checking, code complexity analysis, and test coverage requirements
- **Security**: Dependency vulnerability scanning, CodeQL analysis, secret detection, and license compliance
- **Performance**: Lighthouse CI, bundle size analysis, and accessibility testing

For more details, see [Code Quality and Security Documentation](docs/code-quality-security.md).

## Installation

### Using npm

```bash
# For GitHub Packages
npm install @VijayAditya1609/fdatracker-frontend
```

### Using yarn

```bash
# For GitHub Packages
yarn add @VijayAditya1609/fdatracker-frontend
```

## Authentication Setup for GitHub Packages

To install this package from GitHub Packages, you'll need to authenticate with GitHub:

1. Create a Personal Access Token (PAT) with `read:packages` scope
2. Configure npm to use GitHub Packages:

```bash
# Create or edit ~/.npmrc
npm config set @VijayAditya1609:registry https://npm.pkg.github.com/
npm login --registry=https://npm.pkg.github.com/ --scope=@VijayAditya1609
# Enter your GitHub username, PAT as password, and email
```

## Usage

### Using the Entire Application

```jsx
import { App } from '@VijayAditya1609/fdatracker-frontend';
import '@VijayAditya1609/fdatracker-frontend/dist/style.css'; // If you have CSS output

function MyApp() {
    return (
        <App />
    );
}
```

### Using Individual Components

```jsx
import { 
    Form483Card, 
    InspectionCard, 
    FacilityMap 
} from '@VijayAditya1609/fdatracker-frontend';

function MyComponent() {
    return (
        <div>
            <h1>FDA Compliance Dashboard</h1>
            
            <h2>Recent Form 483s</h2>
            <Form483Card 
                data={form483Data} 
                onClick={handleForm483Click} 
            />
            
            <h2>Recent Inspections</h2>
            <InspectionCard 
                inspection={inspectionData} 
                showDetails={true} 
            />
            
            <h2>Facility Map</h2>
            <FacilityMap 
                facilities={facilityData} 
                height="500px" 
                width="100%" 
            />
        </div>
    );
}
```

### Using Hooks

```jsx
import { 
    useFilters, 
    useInfiniteData, 
    useRecentFDAActions 
} from '@VijayAditya1609/fdatracker-frontend';

function MyFilterComponent() {
    const { filters, setFilters, applyFilters } = useFilters({
        initialFilters: { status: 'active' }
    });
    
    // Use the filters
    return (
        <div>
            <button onClick={() => setFilters({ status: 'closed' })}>
                Show Closed
            </button>
            <button onClick={() => applyFilters()}>
                Apply Filters
            </button>
        </div>
    );
}
```

### Using Services

```jsx
import { 
    DashboardService, 
    Form483Types 
} from '@VijayAditya1609/fdatracker-frontend';

async function fetchDashboardData() {
    try {
        const data = await DashboardService.getDashboardMetrics();
        console.log('Dashboard data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}
```

## Component Documentation

### Dashboard Components

- `FDAActionCard`: Displays a card with FDA action details
- `KeyMetrics`: Shows key metrics for the dashboard
- `RecentFDAActions`: Displays recent FDA actions
- `RecentForm483s`: Shows recent Form 483s
- `RecentWarningLetters`: Displays recent warning letters
- `SubsystemAnalytics`: Shows analytics for subsystems
- `TopInvestigators`: Displays top FDA investigators

### Form 483 Components

- `Form483Card`: Displays a card with Form 483 details
- `ObservationsTab`: Shows observations from a Form 483
- `AnalyticsTab`: Displays analytics for a Form 483
- `ChecklistTab`: Shows a checklist for Form 483 remediation
- `CriticalMetrics`: Displays critical metrics for a Form 483

### Inspection Components

- `InspectionCard`: Displays a card with inspection details
- `InspectionTable`: Shows a table of inspections
- `InspectionGrid`: Displays a grid of inspections
- `InspectionFilters`: Shows filters for inspections
- `InspectionModal`: Displays a modal with inspection details

### Facility Components

- `FacilityCard`: Displays a card with facility details
- `FacilityMap`: Shows a map of facilities

### Common Components

- `AdvancedFilters`: Displays advanced filtering options
- `Alert`: Shows an alert message
- `FilterDropdown`: Displays a dropdown for filtering
- `TabNavigation`: Shows a tab navigation component
- `InfiniteScroll`: Implements infinite scrolling

## Configuration

### API Configuration

You can configure the API endpoints by providing a configuration object:

```jsx
import { App } from '@VijayAditya1609/fdatracker-frontend';

function MyApp() {
    const apiConfig = {
        baseUrl: 'https://api.example.com',
        apiKey: 'your-api-key',
        timeout: 5000
    };

    return (
        <App apiConfig={apiConfig} />
    );
}
```

### Environment Variables

The following environment variables can be set:

- `REACT_APP_API_URL`: The base URL for the API
- `REACT_APP_API_KEY`: The API key for authentication
- `REACT_APP_GA_TRACKING_ID`: Google Analytics tracking ID

## TypeScript Support

This package includes TypeScript definitions for all components, hooks, and utilities.

```tsx
import { Form483Types } from '@VijayAditya1609/fdatracker-frontend';

// Use the types
const form483: Form483Types.Form483 = {
    id: '123',
    companyName: 'Example Pharma',
    // ...other properties
};
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Development

### GitHub Actions Workflows

We use GitHub Actions for CI/CD:

- **Development Release**: Automatically creates development releases with human-readable date and time format (YYYY-MM-DD HH:MM) when code is pushed to the develop branch
- **Package Publishing**: Publishes the package to GitHub Packages
- **Code Quality Checks**: Runs code quality checks on the codebase (develop branch only)
- **Security Analysis**: Performs security analysis on the codebase (develop branch only)
- **Performance & Accessibility**: Analyzes performance and accessibility (develop branch only)

Note: All workflows are configured to run only on the develop branch for experimental purposes.

For more details, see [GitHub Actions Documentation](.github/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
