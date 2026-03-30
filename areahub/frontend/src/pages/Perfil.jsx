import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import perfilService from '../services/perfilService';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function Perfil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchPerfil() {
      try {
        const response = await perfilService.buscar();
        const usuario = response.usuario || response;
        setForm({ nome: usuario.nome || '', email: usuario.email || '', senha: '' });
      } catch {
        setError('Falha ao carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    }

    fetchPerfil();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.nome.trim() || !form.email.trim()) {
      setError('Nome e email sao obrigatorios.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await perfilService.atualizar({
        nome: form.nome,
        email: form.email,
        senha: form.senha || undefined,
      });
      updateUser(response.usuario);
      setSuccess('Perfil atualizado com sucesso.');
      setForm((prev) => ({ ...prev, senha: '' }));
    } catch (err) {
      const msg = err.response?.data?.erro || 'Falha ao atualizar o perfil.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-ambient">
        <h2 className="text-2xl font-bold text-on-surface">Meu Perfil</h2>
        <p className="mt-2 text-sm text-on-surface-variant">Atualize seus dados pessoais e senha.</p>

        {error && (
          <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-xl bg-success-light px-4 py-3 text-sm text-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Seu nome"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="seu@email.com"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Nova senha</label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              placeholder="Digite uma nova senha"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
          >
            {submitting ? <LoadingSpinner size="sm" /> : 'Salvar alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}
