/**
 * App.jsx - Router Principal
 * Responsável pela configuração das rotas da aplicação
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Areas from './pages/Areas';
import AreaDetail from './pages/AreaDetail';
import NovaReserva from './pages/NovaReserva';
import MinhasReservas from './pages/MinhasReservas';
import GerenciarReservas from './pages/GerenciarReservas';
import GerenciarAreas from './pages/GerenciarAreas';
import GerenciarUsuarios from './pages/GerenciarUsuarios';
import GerenciarCondominos from './pages/GerenciarCondominos';
import Perfil from './pages/Perfil';
import PrimeiroAcesso from './pages/PrimeiroAcesso';

function MainLayout({ children }) {
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Sidebar />
      <main style={{ flex: 1, minHeight: '100vh' }}>{children}</main>
    </div>
  );
}

function App() {
  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/primeiro-acesso" element={<ProtectedRoute><PrimeiroAcesso /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><MainLayout><Perfil /></MainLayout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
          <Route path="/areas" element={<ProtectedRoute><MainLayout><Areas /></MainLayout></ProtectedRoute>} />
          <Route path="/areas/:id" element={<ProtectedRoute><MainLayout><AreaDetail /></MainLayout></ProtectedRoute>} />
          <Route path="/reservas/nova" element={<ProtectedRoute><MainLayout><NovaReserva /></MainLayout></ProtectedRoute>} />
          <Route path="/reservas/nova/:areaId" element={<ProtectedRoute><MainLayout><NovaReserva /></MainLayout></ProtectedRoute>} />
          <Route path="/minhas-reservas" element={<ProtectedRoute><MainLayout><MinhasReservas /></MainLayout></ProtectedRoute>} />
          <Route path="/gerenciar-reservas" element={<ProtectedRoute roles={['ADMINISTRADOR', 'SINDICO']}><MainLayout><GerenciarReservas /></MainLayout></ProtectedRoute>} />
          <Route path="/reservas" element={<ProtectedRoute roles={['ADMINISTRADOR', 'SINDICO']}><MainLayout><GerenciarReservas /></MainLayout></ProtectedRoute>} />
          <Route path="/gerenciar-areas" element={<ProtectedRoute roles={['ADMINISTRADOR', 'SINDICO']}><MainLayout><GerenciarAreas /></MainLayout></ProtectedRoute>} />
          <Route path="/gerenciar-usuarios" element={<ProtectedRoute roles={['ADMINISTRADOR']}><MainLayout><GerenciarUsuarios /></MainLayout></ProtectedRoute>} />
          <Route path="/usuarios" element={<ProtectedRoute roles={['ADMINISTRADOR']}><MainLayout><GerenciarUsuarios /></MainLayout></ProtectedRoute>} />
          <Route path="/gerenciar-condominos" element={<ProtectedRoute roles={['ADMINISTRADOR', 'SINDICO']}><MainLayout><GerenciarCondominos /></MainLayout></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
