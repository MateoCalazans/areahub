import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PrimeiroAcesso() {
  const { login, user } = useAuth();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!senha.trim() || !confirmacao.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    if (senha !== confirmacao) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    if (senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authService.primeiroAcesso(senha);
      login(response.token, response.usuario);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Falha ao atualizar senha. Tente novamente.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-ambient">
        <h2 className="text-2xl font-bold text-on-surface">Primeiro Acesso</h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Olá {user?.nome || 'usuário'}, por favor escolha uma nova senha para continuar no sistema.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Nova senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite a nova senha"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Confirmar senha</label>
            <input
              type="password"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              placeholder="Repita a senha"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Atualizar senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
