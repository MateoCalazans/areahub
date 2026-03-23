/**
 * App.jsx - Router Principal
 * Responsável pela configuração das rotas da aplicação
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Areas from './pages/Areas';
import Reservas from './pages/Reservas';
import MinhasReservas from './pages/MinhasReservas';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div style={{ display: 'flex' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <main style={{ flex: 1 }}>
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/areas"
              element={
                <ProtectedRoute>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <main style={{ flex: 1 }}>
                      <Areas />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas"
              element={
                <ProtectedRoute roles={['admin', 'sindico']}>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <main style={{ flex: 1 }}>
                      <Reservas />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/minhas-reservas"
              element={
                <ProtectedRoute>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <main style={{ flex: 1 }}>
                      <MinhasReservas />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute roles={['admin', 'sindico']}>
                  <div style={{ display: 'flex', width: '100%' }}>
                    <Sidebar />
                    <main style={{ flex: 1 }}>
                      <Usuarios />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
