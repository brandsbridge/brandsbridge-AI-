import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import SupplierDashboard from './pages/SupplierDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import FreightDashboard from './pages/FreightDashboard';
import SuperAdminOps from './pages/SuperAdminOps';
import CRMDashboard from './pages/CRMDashboard';
import CRBHub from './pages/CRBHub';
import ProcurementWorkspace from './pages/ProcurementWorkspace';
import LogisticsEcosystem from './pages/LogisticsEcosystem';
import LiveDealRoom from './pages/LiveDealRoom';
import MarketIndexPage from './pages/MarketIndexPage';
import CargoAuctionPage from './pages/CargoAuctionPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import AIAssistant from './components/AIAssistant';

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Inner app (has access to AuthContext)
const AppRoutes = () => {
  const location = useLocation();

  // Check if current path is a dashboard (has its own header)
  const isDashboard =
    location.pathname.startsWith('/supplier') ||
    location.pathname.startsWith('/buyer') ||
    location.pathname.startsWith('/freight') ||
    location.pathname === '/super-admin';

  return (
    <>
      {/* Header - Always shows except on dashboards */}
      {!isDashboard && <Header />}

      {/* Content wrapper with padding for fixed header */}
      <div style={{ paddingTop: isDashboard ? '0' : '68px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/companies/:slug" element={<CompanyProfilePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/market" element={<MarketIndexPage />} />
          <Route path="/auction" element={<CargoAuctionPage />} />

          <Route path="/supplier/dashboard" element={
            <ProtectedRoute allowedRoles={['supplier']}>
              <SupplierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/freight/dashboard" element={
            <ProtectedRoute allowedRoles={['shipping']}>
              <FreightDashboard />
            </ProtectedRoute>
          } />
          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuperAdminOps />
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute>
              <CRMDashboard />
            </ProtectedRoute>
          } />
          <Route path="/crb-hub" element={
            <ProtectedRoute>
              <CRBHub />
            </ProtectedRoute>
          } />
          <Route path="/procurement" element={
            <ProtectedRoute>
              <ProcurementWorkspace />
            </ProtectedRoute>
          } />
          <Route path="/logistics" element={
            <LogisticsEcosystem />
          } />
          <Route path="/live-deal-room" element={
            <ProtectedRoute>
              <LiveDealRoom />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <AIAssistant />
    </>
  );
};

// Root app - AuthProvider wraps EVERYTHING
function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#F9FAFB',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F9FAFB',
            },
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
