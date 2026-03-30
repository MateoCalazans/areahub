import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/areas': 'Areas Disponiveis',
  '/areas/:id': 'Detalhes da Area',
  '/minhas-reservas': 'Minhas Reservas',
  '/reservas/nova': 'Nova Reserva',
  '/gerenciar-reservas': 'Gerenciar Reservas',
  '/gerenciar-areas': 'Gerenciar Areas',
  '/gerenciar-usuarios': 'Gerenciar Usuarios',
  '/gerenciar-condominos': 'Gerenciar Condominos',
  '/perfil': 'Meu Perfil',
  '/primeiro-acesso': 'Primeiro Acesso',
};

const roleLabels = {
  ADMINISTRADOR: 'Admin',
  SINDICO: 'Sindico',
  CONDOMINO: 'Condomino',
};

const roleBadgeColors = {
  ADMINISTRADOR: 'bg-primary/10 text-primary',
  SINDICO: 'bg-secondary-container text-on-secondary-container',
  CONDOMINO: 'bg-primary-fixed text-primary',
};

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();

  const getTitle = () => {
    const path = location.pathname;
    if (pageTitles[path]) return pageTitles[path];
    if (path.startsWith('/areas/')) return 'Detalhes da Area';
    if (path.startsWith('/reservas/nova')) return 'Nova Reserva';
    return 'AreaHub';
  };

  return (
    <header className="flex h-16 items-center justify-between bg-surface-container-lowest px-6 shadow-ambient">
      <h1 className="font-headline text-xl font-semibold text-on-surface">
        {getTitle()}
      </h1>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            roleBadgeColors[user?.role] || 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {roleLabels[user?.role] || user?.role}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
          {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
