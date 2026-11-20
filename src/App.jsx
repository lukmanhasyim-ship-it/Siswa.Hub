import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ROUTE_ROLES } from './config/navigation';

import Layout from './components/Layout';
import Loading from './components/Loading';
import Login from './pages/Login';
import Presensi from './pages/Presensi';
import PresensiPagi from './pages/PresensiPagi';
import PresensiSiang from './pages/PresensiSiang';
import LaporanHarian from './pages/LaporanHarian';
import Keuangan from './pages/Keuangan';
import Panggilan from './pages/Panggilan';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Register from './pages/Register';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Piket from './pages/Piket';
import Feedback from './pages/Feedback';
import CatatanTerlambat from './pages/CatatanTerlambat';

// Halaman berat dimuat sesuai rute agar bundle awal tetap ringan.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MasterSiswa = lazy(() => import('./pages/MasterSiswa'));
const Laporan = lazy(() => import('./pages/Laporan'));
const DKN = lazy(() => import('./pages/DKN'));
const Tanggungan = lazy(() => import('./pages/Tanggungan'));
const BukuKlaper = lazy(() => import('./pages/BukuKlaper'));

// Google OAuth Client ID dari .env
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error('VITE_GOOGLE_CLIENT_ID tidak ditemukan di environment variables.');
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// AppRoutes sengaja tidak memakai.
// Cache TanStack Query yang menjaga kesegaran data; state halaman tetap bertahan
// saat pengguna berpindah halaman sehingga navigasi terasa instan.
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route
          path="master-siswa"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['master-siswa']}>
              <MasterSiswa />
            </RoleProtectedRoute>
          }
        />
        <Route path="profile" element={<Profile />} />
        <Route
          path="tanggungan"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES.tanggungan}>
              <Tanggungan />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="presensi-pagi"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['presensi-pagi']}>
              <PresensiPagi />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="presensi-siang"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['presensi-siang']}>
              <PresensiSiang />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="laporan"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES.laporan}>
              <Laporan />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="laporan-harian"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['laporan-harian']}>
              <LaporanHarian />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="buku-klaper"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['buku-klaper']}>
              <BukuKlaper />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="dkn"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES.dkn}>
              <DKN />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="catatan-terlambat"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['catatan-terlambat']}>
              <CatatanTerlambat />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="update-presensi"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES['update-presensi']}>
              <Presensi />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="keuangan"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES.keuangan}>
              <Keuangan />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="panggilan"
          element={
            <RoleProtectedRoute allowedRoles={ROUTE_ROLES.panggilan}>
              <Panggilan />
            </RoleProtectedRoute>
          }
        />
        <Route path="piket" element={<Piket />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
