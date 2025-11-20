import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Flights from './pages/flights/Flights';
import FlightDetail from './pages/flights/FlightDetail';
import Profile from './pages/profile/Profile';
import Layout from './components/layout/Layout';
import CreateBooking from './pages/bookings/CreateBooking';
import PaymentPage from './pages/payments/PaymentPage';
import PaymentSuccess from './pages/payments/PaymentSuccess';
import MyBookings from './pages/bookings/MyBookings';
import ServicesPage from './pages/services/ServicesPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Flights />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/booking/:flightId" element={
            <ProtectedRoute>
              <Layout>
                <CreateBooking />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payment/:bookingId" element={
            <ProtectedRoute>
              <Layout>
                <PaymentPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={
            <ProtectedRoute>
              <Layout>
                <MyBookings />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/payment/success/:paymentId" element={
            <ProtectedRoute>
              <Layout>
                <PaymentSuccess />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/services" element={
            <ProtectedRoute>
              <Layout>
                <ServicesPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/flight/:flightId" element={
            <ProtectedRoute>
              <Layout>
                <FlightDetail />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;