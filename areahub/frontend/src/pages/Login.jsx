import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={user?.primeiroAcesso ? '/primeiro-acesso' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    if (!senha.trim()) {
      setError('Por favor, informe sua senha.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.login(email, senha);
      login(response.token, response.usuario);
      navigate(response.usuario?.primeiroAcesso ? '/primeiro-acesso' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.error || 'E-mail ou senha incorretos.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - branding */}
      <div className="hidden w-1/2 bg-gradient-to-br from-primary to-primary-container lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="px-12 text-center">
          <span className="material-symbols-outlined mb-4 text-6xl text-on-primary/80">
            apartment
          </span>
          <h1 className="font-headline text-4xl font-bold text-on-primary">
            AreaHub
          </h1>
          <p className="mt-3 text-lg text-on-primary/70">
            Gerencie as reservas de areas comuns do seu condominio de forma simples e eficiente.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full items-center justify-center bg-surface px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="material-symbols-outlined text-3xl text-primary">
              apartment
            </span>
            <span className="font-headline text-2xl font-bold text-primary">
              AreaHub
            </span>
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface">
            Entrar na sua conta
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Acesse o sistema de reservas do condominio
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface shadow-ambient outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-xl bg-surface-container-lowest px-4 py-3 text-sm text-on-surface shadow-ambient outline-none transition-all placeholder:text-outline focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-all hover:bg-primary-container disabled:opacity-60"
            >
              {submitting ? <LoadingSpinner size="sm" /> : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              disabled
              className="text-sm text-outline cursor-not-allowed"
            >
              Esqueceu a senha?
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-on-surface-variant">
            Nao tem conta? Contate o administrador do condominio.
          </p>
        </div>
      </div>
    </div>
  );
}
