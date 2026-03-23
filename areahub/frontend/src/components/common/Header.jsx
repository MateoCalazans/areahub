/**
 * Componente Header
 * Responsável pela navegação e exibição do menu superior
 */

import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem' }}>
          AreaHub
        </Link>
        <nav>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={{ color: '#fff', marginRight: '1rem' }}>
                Dashboard
              </Link>
              <Link to="/areas" style={{ color: '#fff', marginRight: '1rem' }}>
                Áreas
              </Link>
              <Link to="/minhas-reservas" style={{ color: '#fff', marginRight: '1rem' }}>
                Minhas Reservas
              </Link>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff' }}>
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
