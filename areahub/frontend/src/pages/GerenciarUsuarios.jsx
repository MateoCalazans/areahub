import { useState, useEffect } from 'react';
import usuarioService from '../services/usuarioService';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const emptyForm = {
  nome: '',
  email: '',
  senha: '',
  role: 'CONDOMINO',
  unidade: '',
};

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    setLoading(true);
    try {
      const response = await usuarioService.listar();
      setUsuarios(response.usuarios || response || []);
    } catch {
      setError('Falha ao carregar usuarios.');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(user) {
    setEditingId(user.id);
    setForm({
      nome: user.nome || '',
      email: user.email || '',
      senha: '',
      role: user.role || 'CONDOMINO',
      unidade: user.condomino?.unidade || '',
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.nome.trim()) {
      setFormError('O nome e obrigatorio.');
      return;
    }
    if (!form.email.trim()) {
      setFormError('O e-mail e obrigatorio.');
      return;
    }
    if (!editingId && !form.senha.trim()) {
      setFormError('A senha e obrigatoria para novos usuarios.');
      return;
    }
    if (form.role === 'CONDOMINO' && !form.unidade.trim()) {
      setFormError('A unidade e obrigatoria para condominos.');
      return;
    }

    setSubmitting(true);
    setSuccess('');
    setPreviewUrl('');
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        role: form.role,
      };
      if (form.senha) payload.senha = form.senha;
      if (form.role === 'CONDOMINO') payload.unidade = form.unidade;

      const response = editingId
        ? await usuarioService.atualizar(editingId, payload)
        : await usuarioService.criar(payload);

      setModalOpen(false);
      fetchUsuarios();

      if (editingId) {
        setSuccess('Usuario atualizado com sucesso.');
      } else {
        setSuccess('Usuario criado com sucesso.');
        if (response.previewUrl) {
          setPreviewUrl(response.previewUrl);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.error || 'Falha ao salvar usuario.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(usuario) {
    const id = usuario.id;
    try {
      await usuarioService.alterarStatus(id, !usuario.status);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
      );
    } catch {
      setError('Falha ao alterar status do usuario.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente excluir este usuario?')) return;
    try {
      await usuarioService.deletar(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError('Falha ao excluir usuario.');
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const roleLabels = {
    ADMINISTRADOR: 'Administrador',
    SINDICO: 'Sindico',
    CONDOMINO: 'Condomino',
  };

  const roleBadgeColors = {
    ADMINISTRADOR: 'bg-primary/10 text-primary',
    SINDICO: 'bg-secondary-container text-on-secondary-container',
    CONDOMINO: 'bg-primary-fixed text-primary',
  };

  const usersList = Array.isArray(usuarios) ? usuarios : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Gerenciar Usuarios</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Cadastre e gerencie os usuarios do sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Novo Usuario
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl bg-success-light px-4 py-3 text-sm text-success">
          {success}
          {previewUrl && (
            <div className="mt-2 text-xs text-primary">
              Preview do email: <a href={previewUrl} target="_blank" rel="noreferrer" className="underline">Clique aqui</a>
            </div>
          )}
        </div>
      )}

      {usersList.length === 0 ? (
        <EmptyState icon="group_off" message="Nenhum usuario encontrado" />
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">E-mail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Perfil</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {usersList.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-surface-container-low/50">
                  <td className="px-4 py-3 text-sm font-medium text-on-surface">{u.nome}</td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeColors[u.role] || 'bg-surface-container text-on-surface-variant'}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.status ? 'bg-success-light text-success' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {u.status ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(u)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-surface-container-high"
                        title={u.status ? 'Desativar' : 'Ativar'}
                      >
                        <span className="material-symbols-outlined text-lg">toggle_on</span>
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-error transition-colors hover:bg-error-container"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Usuario' : 'Novo Usuario'}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Nome</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Nome completo"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">E-mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@exemplo.com"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">
              Senha {editingId && '(deixe em branco para manter)'}
            </label>
            <input
              type="password"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              placeholder={editingId ? 'Nova senha (opcional)' : 'Senha'}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Perfil</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="CONDOMINO">Condomino</option>
              <option value="SINDICO">Sindico</option>
              <option value="ADMINISTRADOR">Administrador</option>
            </select>
          </div>
          {form.role === 'CONDOMINO' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">Unidade</label>
              <input
                type="text"
                value={form.unidade}
                onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                placeholder="Ex: Apt 101"
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-highest"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container disabled:opacity-60"
            >
              {submitting ? <LoadingSpinner size="sm" /> : editingId ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
