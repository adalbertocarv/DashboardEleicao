import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MapView = lazy(() => import('./pages/MapView'));
const Researchers = lazy(() => import('./pages/Researchers'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));

// Routes that should be protected
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real application, you would check if the user is authenticated
  const isAuthenticated = true; // Replace with actual auth check
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Login />
        </Suspense>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="map" element={
          <Suspense fallback={<LoadingSpinner />}>
            <MapView />
          </Suspense>
        } />
        <Route path="researchers" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Researchers />
          </Suspense>
        } />
        <Route path="analytics" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Reports />
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Settings />
          </Suspense>
        } />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;