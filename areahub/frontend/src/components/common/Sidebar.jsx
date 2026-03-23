/**
 * Componente Sidebar
 * Responsável pela navegação lateral da aplicação
 */

import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin' || user?.role === 'sindico';

  return (
    <aside style={{ width: '200px', padding: '1rem', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/areas">Áreas</Link>
        <Link to="/minhas-reservas">Minhas Reservas</Link>
        {isAdmin && (
          <>
            <Link to="/reservas">Todas as Reservas</Link>
            <Link to="/usuarios">Gerenciar Usuários</Link>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
