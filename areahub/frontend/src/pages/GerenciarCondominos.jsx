import { useState, useEffect } from 'react';
import condominoService from '../services/condominoService';
import usuarioService from '../services/usuarioService';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const emptyForm = {
  nome: '',
  email: '',
  senha: '',
  unidade: '',
};

export default function GerenciarCondominos() {
  const [condominos, setCondominos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCondominos();
  }, []);

  async function fetchCondominos() {
    setLoading(true);
    try {
      const response = await condominoService.listar();
      setCondominos(response.condominos || response || []);
    } catch {
      // Fallback: try loading users with CONDOMINO role
      try {
        const response = await usuarioService.listar();
        const users = response.usuarios || response || [];
        const condList = (Array.isArray(users) ? users : []).filter((u) => u.role === 'CONDOMINO');
        setCondominos(condList);
      } catch {
        setError('Falha ao carregar condominos.');
      }
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

  function openEdit(cond) {
    const id = cond.id || cond.id_condomino;
    setEditingId(id);
    setForm({
      nome: cond.usuario?.nome || cond.nome || '',
      email: cond.usuario?.email || cond.email || '',
      senha: '',
      unidade: cond.unidade || cond.condomino?.unidade || '',
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.unidade.trim()) {
      setFormError('A unidade e obrigatoria.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await condominoService.atualizar(editingId, { unidade: form.unidade });
      } else {
        if (!form.nome.trim()) {
          setFormError('O nome e obrigatorio.');
          setSubmitting(false);
          return;
        }
        if (!form.email.trim()) {
          setFormError('O e-mail e obrigatorio.');
          setSubmitting(false);
          return;
        }
        if (!form.senha.trim()) {
          setFormError('A senha e obrigatoria.');
          setSubmitting(false);
          return;
        }
        // Create user then condomino
        await usuarioService.criar({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          role: 'CONDOMINO',
          unidade: form.unidade,
        });
      }
      setModalOpen(false);
      fetchCondominos();
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.error || 'Falha ao salvar condomino.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente excluir este condomino?')) return;
    try {
      await condominoService.deletar(id);
      setCondominos((prev) => prev.filter((c) => (c.id || c.id_condomino) !== id));
    } catch {
      setError('Falha ao excluir condomino.');
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const condList = Array.isArray(condominos) ? condominos : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Gerenciar Condominos</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Cadastre e gerencie os condominos</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          Novo Condomino
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {condList.length === 0 ? (
        <EmptyState icon="group_off" message="Nenhum condomino encontrado" description="Cadastre um novo condomino clicando no botao acima" />
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">E-mail</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Unidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {condList.map((c) => {
                const cid = c.id || c.id_condomino;
                return (
                  <tr key={cid} className="transition-colors hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 text-sm font-medium text-on-surface">
                      {c.usuario?.nome || c.nome || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {c.usuario?.email || c.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {c.unidade || c.condomino?.unidade || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(c)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cid)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-error transition-colors hover:bg-error-container"
                          title="Excluir"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Editar Condomino' : 'Novo Condomino'}
      >
        {formError && (
          <div className="mb-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <>
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
                <label className="mb-1.5 block text-sm font-medium text-on-surface">Senha</label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  placeholder="Senha"
                  className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </>
          )}
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
