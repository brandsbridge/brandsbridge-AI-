import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BuyerProvider } from './context/BuyerContext';
import { SupplierProvider } from './context/SupplierContext';
import { GlobalTradeProvider } from './contexts/GlobalTradeContext';
import { ContractProvider } from './contexts/ContractContext';
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
import SupplierProfileEditor from './pages/SupplierProfileEditor';
import ClaimProfilePage from './pages/ClaimProfilePage';
import ExpoPage from './pages/ExpoPage';
import VRExperiencePage from './pages/VRExperiencePage';
import BuyerLiveRadar from './pages/BuyerLiveRadar';
import BuyerDocumentsPage from './pages/BuyerDocumentsPage';
import BuyerRFQsPage from './pages/BuyerRFQsPage';
import BuyerRFQDetailPage from './pages/BuyerRFQDetailPage';
import BuyerOrdersPage from './pages/BuyerOrdersPage';
import BuyerShipmentDetailPage from './pages/BuyerShipmentDetailPage';
import BuyerAISourcingPage from './pages/BuyerAISourcingPage';
import BuyerSettingsPage from './pages/BuyerSettingsPage';
import CarrierDashboard from './pages/CarrierDashboard';
import ThreePLDashboard from './pages/ThreePLDashboard';
import ThreePLProfilePage from './pages/ThreePLProfilePage';
import SuggestedSuppliersPage from './pages/SuggestedSuppliersPage';
import { ContractRoom } from './pages/ContractRoom';
import LiveStateSync from './components/contract/LiveStateSync';

// Supplier Cargo Auction pages
import CargoAuctionDashboard from './pages/supplier/CargoAuctionDashboard';
import CreateCargoListing from './pages/supplier/CreateCargoListing';
import CargoReservations from './pages/supplier/CargoReservations';
import CargoPerformance from './pages/supplier/CargoPerformance';

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

// Inner app (has access to AuthContext and BuyerContext)
const AppRoutes = () => {
  const location = useLocation();

  // Check if current path is a dashboard (has its own header)
  const isDashboard =
    location.pathname.startsWith('/supplier') ||
    location.pathname.startsWith('/buyer') ||
    location.pathname.startsWith('/freight') ||
    location.pathname.startsWith('/carrier') ||
    location.pathname.startsWith('/3pl') ||
    location.pathname.startsWith('/contract-room') ||
    location.pathname === '/super-admin' ||
    location.pathname === '/crm' ||
    location.pathname === '/crb-hub' ||
    location.pathname === '/live-deal-room';

  // Landing page has its own nav bar
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {/* Header - Always shows except on dashboards and landing page */}
      {!isDashboard && !isLandingPage && <Header />}

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
          <Route path="/market-prices" element={<MarketIndexPage />} />
          <Route path="/auction" element={<CargoAuctionPage />} />
          <Route path="/cargo-auction" element={<CargoAuctionPage />} />

          {/* Supplier Routes - wrapped with SupplierProvider */}
          <Route path="/supplier/dashboard" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <SupplierDashboard />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/supplier/profile-editor" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <SupplierProfileEditor />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/crm" element={
            <SupplierProvider>
              <ProtectedRoute>
                <CRMDashboard />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/crb-hub" element={
            <SupplierProvider>
              <ProtectedRoute>
                <CRBHub />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/live-deal-room" element={
            <SupplierProvider>
              <ProtectedRoute>
                <LiveDealRoom />
              </ProtectedRoute>
            </SupplierProvider>
          } />

          {/* Cargo Auction Supplier Routes */}
          <Route path="/supplier/cargo-auction" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <CargoAuctionDashboard />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/supplier/cargo-auction/new" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <CreateCargoListing />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/supplier/cargo-auction/edit/:id" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <CreateCargoListing />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/supplier/cargo-auction/reservations" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <CargoReservations />
              </ProtectedRoute>
            </SupplierProvider>
          } />
          <Route path="/supplier/cargo-auction/stats" element={
            <SupplierProvider>
              <ProtectedRoute allowedRoles={['supplier']}>
                <CargoPerformance />
              </ProtectedRoute>
            </SupplierProvider>
          } />

          <Route path="/claim/:companySlug" element={<ClaimProfilePage />} />
          <Route path="/expo/:expoId" element={<ExpoPage />} />
          <Route path="/live-expo" element={<ExpoPage />} />
          <Route path="/vr-experience" element={<VRExperiencePage />} />

          {/* Buyer Routes - wrapped with BuyerProvider */}
          <Route path="/buyer/dashboard" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/buyer/rfqs" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerRFQsPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/rfqs/:rfqId" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerRFQDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/orders" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/orders/:shipmentId" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerShipmentDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/live-radar" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerLiveRadar />
            </ProtectedRoute>
          } />
          <Route path="/buyer/documents" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerDocumentsPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/ai-sourcing" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerAISourcingPage />
            </ProtectedRoute>
          } />
          <Route path="/buyer/settings" element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerSettingsPage />
            </ProtectedRoute>
          } />

          <Route path="/freight/dashboard" element={
            <ProtectedRoute allowedRoles={['shipping']}>
              <FreightDashboard />
            </ProtectedRoute>
          } />
          <Route path="/carrier/dashboard" element={
            <ProtectedRoute allowedRoles={['carrier']}>
              <CarrierDashboard />
            </ProtectedRoute>
          } />
          <Route path="/3pl/dashboard" element={
            <ProtectedRoute allowedRoles={['3pl']}>
              <ThreePLDashboard />
            </ProtectedRoute>
          } />
          <Route path="/3pl/profile" element={
            <ProtectedRoute allowedRoles={['3pl']}>
              <ThreePLProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/3pl/suggested" element={
            <ProtectedRoute allowedRoles={['3pl']}>
              <SuggestedSuppliersPage />
            </ProtectedRoute>
          } />

          {/* Contract Room - Tri-Party Contract Management */}
          <Route path="/contract-room/:contractId" element={
            <ContractProvider>
              <ContractRoom />
            </ContractProvider>
          } />

          {/* Live State Sync Demo */}
          <Route path="/live-state-sync" element={
            <ContractProvider>
              <GlobalTradeProvider>
                <LiveStateSync />
              </GlobalTradeProvider>
            </ContractProvider>
          } />

          <Route path="/super-admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuperAdminOps />
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
          <BuyerProvider>
            <GlobalTradeProvider>
              <AppRoutes />
            </GlobalTradeProvider>
          </BuyerProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
