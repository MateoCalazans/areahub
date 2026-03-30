import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const allLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/areas', label: 'Áreas' },
  { to: '/reservas', label: 'Reservas', roles: ['ADMINISTRADOR', 'SINDICO'] },
  { to: '/minhas-reservas', label: 'Minhas Reservas' },
  { to: '/usuarios', label: 'Usuários', roles: ['ADMINISTRADOR'] },
];

export default function Sidebar() {
  const { user } = useAuth();

  const links = allLinks.filter((link) => {
    if (!link.roles) return true;
    return link.roles.includes(user?.role);
  });

  return (
    <aside className="min-h-screen w-64 border-r border-slate-200 bg-slate-50 px-4 py-6">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
