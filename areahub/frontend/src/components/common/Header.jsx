import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 bg-primary px-6 py-4 text-white shadow-md">
      <div>
        <h1 className="text-xl font-bold">AreaHub</h1>
        <p className="text-sm text-primary-content/80">Gestão de áreas comuns do condomínio</p>
      </div>

      {isAuthenticated && (
        <div className="flex items-center gap-4 text-sm">
          <span className="rounded-full bg-primary-content/10 px-3 py-1 text-primary-content">
            {user?.nome || 'Visitante'}
          </span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg bg-white px-4 py-2 text-primary shadow-sm transition hover:bg-slate-100"
          >
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
