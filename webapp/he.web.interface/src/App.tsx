import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './components/landing/LandingPage';
import { ContactPage } from './components/contact/ContactPage';
import { TermsPage } from './components/legal/TermsPage';
import { PrivacyPage } from './components/legal/PrivacyPage';
import { HipaaPage } from './components/legal/HipaaPage';
import { FeaturesPage } from './components/features/FeaturesPage';
import { DevelopersPage } from './components/developers/DevelopersPage';
import { AboutPage } from './components/about/AboutPage';
import { CareersPage } from './components/careers/CareersPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { AccountSetupPage } from './components/account/AccountSetupPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { DischargeSummariesList } from './components/dashboard/DischargeSummariesList';
import { DischargeSummaryDetail } from './components/dashboard/DischargeSummaryDetail';
import { HospitalsList } from './components/dashboard/HospitalsList';
import { PatientsList } from './components/dashboard/PatientsList';
import { PatientDetail } from './components/dashboard/PatientDetail';
import { CareTransitionsList } from './components/care-transitions/CareTransitionsList';
import { CareTransitionDetail } from './components/care-transitions/CareTransitionDetail';
import { CareTransitionAction } from './components/care-transitions/CareTransitionAction';
import { SettingsLayout } from './components/settings/SettingsLayout';
import { AccountDetailsPage } from './components/settings/AccountDetailsPage';
import { AccountSettings } from './components/settings/AccountSettings';
import { MembersSettings } from './components/settings/MembersSettings';
import { UserProfilePage } from './components/settings/UserProfilePage';
import { AuthInitializer } from './components/auth/AuthInitializer';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/hipaa" element={<HipaaPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/account-setup" element={<AccountSetupPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="discharge-summaries" element={<DischargeSummariesList />} />
              <Route path="discharge-summaries/:id" element={<DischargeSummaryDetail />} />
              <Route path="care-transitions" element={<CareTransitionsList />} />
              <Route path="care-transitions/:id" element={<CareTransitionDetail />} />
              <Route path="care-transitions/encounter/:encounterKey" element={<CareTransitionAction />} />
              <Route path="hospitals" element={<HospitalsList />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patients/:id" element={<PatientDetail />} />
              <Route path="settings" element={<AdminRoute><SettingsLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/app/settings/account-details" replace />} />
                <Route path="account-details" element={<AccountDetailsPage />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="members" element={<MembersSettings />} />
                <Route path="profile" element={<UserProfilePage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthInitializer>
    </QueryClientProvider>
  );
}

export default App;







