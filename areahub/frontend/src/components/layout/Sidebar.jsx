import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const roleLabels = {
  ADMINISTRADOR: 'Administrador',
  SINDICO: 'Sindico',
  CONDOMINO: 'Condomino',
};

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          isActive
            ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-ambient'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`
      }
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role;

  const condominoLinks = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/areas', icon: 'location_city', label: 'Areas Disponiveis' },
    { to: '/minhas-reservas', icon: 'event_note', label: 'Minhas Reservas' },
  ];

  const sindicoLinks = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/areas', icon: 'location_city', label: 'Areas' },
    { to: '/gerenciar-reservas', icon: 'event_available', label: 'Reservas' },
    { to: '/gerenciar-condominos', icon: 'groups', label: 'Condominos' },
    { to: '/gerenciar-areas', icon: 'edit_location_alt', label: 'Gerenciar Areas' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/gerenciar-reservas', icon: 'event_available', label: 'Reservas' },
    { to: '/gerenciar-usuarios', icon: 'manage_accounts', label: 'Usuarios' },
    { to: '/areas', icon: 'location_city', label: 'Areas' },
    { to: '/gerenciar-condominos', icon: 'groups', label: 'Condominos' },
  ];

  let links = condominoLinks;
  if (role === 'ADMINISTRADOR') links = adminLinks;
  else if (role === 'SINDICO') links = sindicoLinks;

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-surface-container-low">
      {/* Logo */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary-container px-5 py-5">
        <span className="material-symbols-outlined text-2xl text-on-primary">
          apartment
        </span>
        <span className="font-headline text-xl font-bold text-on-primary">
          AreaHub
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        {links.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </nav>

      {/* User info */}
      <div className="bg-surface-container px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-on-primary">
            {user?.nome?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-on-surface">
              {user?.nome || 'Usuario'}
            </p>
            <p className="text-xs text-on-surface-variant">
              {roleLabels[role] || role}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
            title="Sair"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
        <div className="mt-4">
          <SidebarLink to="/perfil" icon="person" label="Meu Perfil" />
        </div>
      </div>
    </aside>
  );
}
