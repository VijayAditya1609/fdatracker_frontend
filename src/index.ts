/**
 * FDA Tracker Frontend Package
 * 
 * This is the main entry point for the FDA Tracker Frontend package.
 * It exports all components, hooks, contexts, services, and utilities
 * that are available to consumers of this package.
 */

// Export the main App component
export { default as App } from './App';

// Export components
export * from './components/Navbar';
export * from './components/Sidebar';

// Auth components
export * from './components/auth/EmailVerification';
export * from './components/auth/ForgotPassword';
export * from './components/auth/LoginForm';
export * from './components/auth/ProtectedRoute';
export * from './components/auth/ResetPassword';
export * from './components/auth/SignupForm';
export * from './components/auth/TroubleLoggingIN';

// Common components
export * from './components/common/AdvancedFilters';
export * from './components/common/Alert';
export * from './components/common/DocumentHeader';
export * from './components/common/FacilityInfoCard';
export * from './components/common/FilterBadges';
export * from './components/common/FilterDropdown';
export * from './components/common/InfiniteScroll';
export * from './components/common/RiskAssessmentCard';
export * from './components/common/TabNavigation';

// Companies components
export * from './components/companies/CompanyCard';

// Comparison components
export * from './components/comparison/CompanySelector';
export * from './components/comparison/ComparisonMetrics';
export * from './components/comparison/InspectionHistory';
export * from './components/comparison/ProductPortfolio';
export * from './components/comparison/RegulatoryTimeline';

// Dashboard components
export * from './components/dashboard/FDAActionCard';
export * from './components/dashboard/index';
export * from './components/dashboard/KeyMetrics';
export * from './components/dashboard/Navbar';
export * from './components/dashboard/RecentFDAActions';
export * from './components/dashboard/RecentForm483s';
export * from './components/dashboard/RecentWarningLetters';
export * from './components/dashboard/Sidebar';
export * from './components/dashboard/SubscriptionButton';
export * from './components/dashboard/SubsystemAnalytics';
export * from './components/dashboard/TopInvestigators';

// Facilities components
export * from './components/facilities/FacilityCard';

// Form483 components
export * from './components/form483/ActiveFilters';
export * from './components/form483/AnalyticsTab';
export * from './components/form483/ChecklistTab';
export * from './components/form483/CriticalMetrics';
export * from './components/form483/FilterBar';
export * from './components/form483/Form483Card';
export * from './components/form483/InspectionSummary';
export * from './components/form483/ObservationsTab';
export * from './components/form483/OverviewTab';
export * from './components/form483/SearchBar';
export * from './components/form483/UpgradeMessage';

// Inspections components
export * from './components/inspections/ActiveFilters';
export * from './components/inspections/FilterBar';
export * from './components/inspections/InspectionCard';
export * from './components/inspections/InspectionFilters';
export * from './components/inspections/InspectionGrid';
export * from './components/inspections/InspectionModal';
export * from './components/inspections/InspectionTable';
export * from './components/inspections/Pagination';

// Investigators components
export * from './components/investigators/InvestigatorCard';
export * from './components/investigators/InvestigatorFilters';
export * from './components/investigators/UpgradeMessage';

// Landing components
export * from './components/landing/CTA';
export * from './components/landing/DashboardPreview';
export * from './components/landing/Features';
export * from './components/landing/Footer';
export * from './components/landing/Hero';
export * from './components/landing/Logo';
export * from './components/landing/Navbar';

// Layout components
export * from './components/layouts/DashboardLayout';

// Map components
export * from './components/map/FacilityMap';

// Export contexts
export * from './contexts/AuthContext';

// Export hooks
export * from './hooks/useAdvancedFilters';
export * from './hooks/useDebounce';
export * from './hooks/useDocumentTitle';

// Handle hooks with potential naming conflicts
import * as FiltersHook from './hooks/useFilters';
export { FiltersHook };

export * from './hooks/useInfiniteData';
export * from './hooks/useRecentFDAActions';
export * from './hooks/useSixSystems';

// Export services
export * from './services/auth';
export * from './services/authFetch';
export * from './services/companyComparison';

// Handle services with potential naming conflicts
import * as DashboardService from './services/dashboard';
export { DashboardService };

export * from './services/facilities';
export * from './services/facility';
export * from './services/filters';
export * from './services/form483';
export * from './services/inspection';
export * from './services/investigators';
export * from './services/observation';
export * from './services/search';
export * from './services/sixSystems';
export * from './services/systems';
export * from './services/violation';

// Export types with namespace to avoid conflicts
import * as CompanyTypes from './types/company';
import * as ComparisonTypes from './types/companyComparison';
import * as FacilityTypes from './types/facility';
import * as Form483Types from './types/form483';
import * as InspectionTypes from './types/inspection';
import * as InvestigatorTypes from './types/investigator';
import * as SystemTypes from './types/system';
import * as WarningLetterTypes from './types/warningLetter';

export {
  CompanyTypes,
  ComparisonTypes,
  FacilityTypes,
  Form483Types,
  InspectionTypes,
  InvestigatorTypes,
  SystemTypes, 
  WarningLetterTypes
};

// Export utils
export * from './utils/analytics';
export * from './utils/chartOptions';
export * from './utils/searchUtils';
export * from './utils/subscriptionUtils';
export * from './utils/systemCalculations';

// Export pages
export * from './pages/Canceled';
export * from './pages/CompaniesPage';
export * from './pages/CompanyComparisonPage';
export * from './pages/CompanyDetailsPage';
export * from './pages/DashboardPage';
export * from './pages/EIRsPage';
export * from './pages/FacilitiesPage';
export * from './pages/FacilityDetialPage';
export * from './pages/ForgotPasswordPage';
export * from './pages/Form483DetailsPage';
export * from './pages/Form483sPage';
export * from './pages/InspectionDetailsPage';
export * from './pages/InspectionsPage';
export * from './pages/InvestigatorDetailPage';
export * from './pages/InvestigatorsPage';
export * from './pages/LandingPage';
export * from './pages/LoginPage';
export * from './pages/MyForm483Page';
export * from './pages/NotFoundPage';
export * from './pages/ObservationAnalysisPage';
export * from './pages/ObservationDetailPage';
export * from './pages/ProductsPage';
export * from './pages/RecallsPage';
export * from './pages/ResetPasswordPage';
export * from './pages/SearchPage';
export * from './pages/SignupPage';
export * from './pages/SimilarObservationsPage';
export * from './pages/SOPRiskAssessmentPage';
export * from './pages/Subscription';
export * from './pages/SubsystemDetailPage';
export * from './pages/Success';
export * from './pages/SystemDetailPage';
export * from './pages/SystemPage';
export * from './pages/UserAnalyticsPage';
export * from './pages/UserDetailsPage';
export * from './pages/ViolationAnalysisPage';
export * from './pages/ViolationDetailPage';
export * from './pages/WarningLetterDetailsPage';
export * from './pages/WarningLettersPage';

// Export config
export * from './config/api';
export * from './config/filters';

// Export constants
export * from './constants/systemMappings';
