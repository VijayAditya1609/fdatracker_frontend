import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TroubleLoggingIn from './components/auth/TroubleLoggingIN';
import DashboardPage from './pages/DashboardPage';
import CompanyComparisonPage from './pages/CompanyComparisonPage';
import Form483sPage from './pages/Form483sPage';
import WarningLettersPage from './pages/WarningLettersPage';
import InspectionsPage from './pages/InspectionsPage';
import InspectionDetailsPage from './pages/InspectionDetailsPage';
import RecallsPage from './pages/RecallsPage';
import EIRsPage from './pages/EIRsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import ProductsPage from './pages/ProductsPage';
import SearchPage from './pages/SearchPage';
import SOPRiskAssessmentPage from './pages/SOPRiskAssessmentPage';
import Form483DetailsPage from './pages/Form483DetailsPage';
import ObservationDetailPage from './pages/ObservationDetailPage';
import WarningLetterDetailsPage from './pages/WarningLetterDetailsPage';
import ViolationDetailPage from './pages/ViolationDetailPage';
import SystemPage from './pages/SystemPage';
import SystemDetailPage from './pages/SystemDetailPage';
import InvestigatorsPage from './pages/InvestigatorsPage';
import InvestigatorDetailPage from './pages/InvestigatorDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import SubsystemDetailPage from './pages/SubsystemDetailPage';
import FacilityDetailPage from './pages/FacilityDetialPage';
import EmailVerification from './components/auth/EmailVerification';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import ObservationAnalysisPage from './pages/ObservationAnalysisPage';
import ViolationAnalysisPage from './pages/ViolationAnalysisPage';
import { initGA, logPageView } from './utils/analytics';
import Subscription from './pages/Subscription.tsx';
import Success from './pages/Success.tsx';
import Canceled from './pages/Canceled.tsx';


// Create a separate component for routes that needs access to location
function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    // Log page view whenever location changes
    try {
      logPageView(location.pathname, document.title);
    } catch (error) {
      console.error('Error in page view logging:', error);
    }
  }, [location]);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/trouble-logging-in" element={<TroubleLoggingIn />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/inspections" element={
          <ProtectedRoute>
            <InspectionsPage />
          </ProtectedRoute>
        } />
        <Route path="/inspections/:id" element={
          <ProtectedRoute>
            <InspectionDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/form-483s" element={
          <ProtectedRoute>
            <Form483sPage />
          </ProtectedRoute>
        } />
        <Route path="/form-483s/:id" element={
          <ProtectedRoute>
            <Form483DetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/form-483s/:pdfId/analysis/:observationId" element={<ObservationAnalysisPage />} />
        <Route path="/form-483s/observations/:id" element={
          <ProtectedRoute>
            <ObservationDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/warning-letters" element={
          <ProtectedRoute>
            <WarningLettersPage />
          </ProtectedRoute>
        } />
        <Route path="/warning-letters/:id" element={
          <ProtectedRoute>
            <WarningLetterDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/warning-letters/violations/:id" element={
          <ProtectedRoute>
            <ViolationDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/warning-letters/:warningLetterId/analysis/:violationId" element={<ViolationAnalysisPage />} />
        <Route path="/recalls" element={
          <ProtectedRoute>
            <RecallsPage />
          </ProtectedRoute>
        } />
        <Route path="/eirs" element={
          <ProtectedRoute>
            <EIRsPage />
          </ProtectedRoute>
        } />
        <Route path="/companies" element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        } />
        <Route path="/companies/:id" element={
          <ProtectedRoute>
            <CompanyDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/company-comparison" element={
          <ProtectedRoute>
            <CompanyComparisonPage />
          </ProtectedRoute>
        } />
        <Route path="/facilities" element={
          <ProtectedRoute>
            <FacilitiesPage />
          </ProtectedRoute>
        } />
        <Route path="/facilities/:feinumber" element={
          <ProtectedRoute>
            <FacilityDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="/sixSystems" element={
          <ProtectedRoute>
            <SystemPage />
          </ProtectedRoute>
        } />
        <Route path="/systems/:system_id" element={
          <ProtectedRoute>
            <SystemDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/systems/:system_id/subsystems/:subsystem_id" element={
          <ProtectedRoute>
            <SubsystemDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/sop-assessment" element={
          <ProtectedRoute>
            <SOPRiskAssessmentPage />
          </ProtectedRoute>
        } />
        <Route path="/investigators" element={
          <ProtectedRoute>
            <InvestigatorsPage />
          </ProtectedRoute>
        } />
        <Route path="/investigators/:id" element={
          <ProtectedRoute>
            <InvestigatorDetailPage />
          </ProtectedRoute>
        } />
         <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />
          <Route path="/Success" element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          } />
          <Route path="/Canceled" element={
            <ProtectedRoute>
              <Canceled />
            </ProtectedRoute>
          } />
          

        {/* Fallback route */}
        {/* 404 Route */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

function App() {
  useEffect(() => {
    // Initialize GA only once when the app loads
    try {
      initGA('G-7D90LTLKZJ');
      console.log('GA initialization attempted');
    } catch (error) {
      console.error('Error in GA initialization:', error);
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
