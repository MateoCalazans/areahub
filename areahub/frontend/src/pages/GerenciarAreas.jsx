import { useState, useEffect } from 'react';
import areaService from '../services/areaService';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

const emptyForm = {
  nome: '',
  descricao: '',
  capacidade: '',
  horarioAbertura: '08:00',
  horarioFechamento: '22:00',
  ativa: true,
};

export default function GerenciarAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    setLoading(true);
    try {
      const response = await areaService.listar();
      setAreas(response.areas || response || []);
    } catch {
      setError('Falha ao carregar areas.');
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

  function openEdit(area) {
    setEditingId(area.id || area.id_area);
    setForm({
      nome: area.nome || '',
      descricao: area.descricao || '',
      capacidade: area.capacidade || '',
      horarioAbertura: area.horarioAbertura || area.horario_abertura || '08:00',
      horarioFechamento: area.horarioFechamento || area.horario_fechamento || '22:00',
      ativa: area.ativa !== undefined ? area.ativa : true,
    });
    setFormError('');
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.nome.trim()) {
      setFormError('O nome da area e obrigatorio.');
      return;
    }
    if (!form.capacidade || parseInt(form.capacidade, 10) <= 0) {
      setFormError('Informe uma capacidade valida.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        capacidade: parseInt(form.capacidade, 10),
        horarioAbertura: form.horarioAbertura,
        horarioFechamento: form.horarioFechamento,
        ativa: form.ativa,
      };

      if (editingId) {
        await areaService.atualizar(editingId, payload);
      } else {
        await areaService.criar(payload);
      }
      setModalOpen(false);
      fetchAreas();
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.error || 'Falha ao salvar area.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente excluir esta area?')) return;
    try {
      await areaService.deletar(id);
      setAreas((prev) => prev.filter((a) => (a.id || a.id_area) !== id));
    } catch {
      setError('Falha ao excluir area.');
    }
  }

  async function handleToggle(area) {
    const id = area.id || area.id_area;
    try {
      await areaService.atualizar(id, { ativa: !area.ativa });
      setAreas((prev) =>
        prev.map((a) => ((a.id || a.id_area) === id ? { ...a, ativa: !a.ativa } : a))
      );
    } catch {
      setError('Falha ao atualizar status da area.');
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  const areasList = Array.isArray(areas) ? areas : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface">Gerenciar Areas</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Cadastre e gerencie as areas comuns</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nova Area
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {areasList.length === 0 ? (
        <EmptyState icon="location_off" message="Nenhuma area cadastrada" description="Crie uma nova area clicando no botao acima" />
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Capacidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Horario</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {areasList.map((area) => {
                const aid = area.id || area.id_area;
                return (
                  <tr key={aid} className="transition-colors hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 text-sm font-medium text-on-surface">{area.nome}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">{area.capacidade} pessoas</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant">
                      {area.horarioAbertura || area.horario_abertura} - {area.horarioFechamento || area.horario_fechamento}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(area)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          area.ativa
                            ? 'bg-success-light text-success'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {area.ativa ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(area)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(aid)}
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
        title={editingId ? 'Editar Area' : 'Nova Area'}
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
              placeholder="Nome da area"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Descricao</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Descricao da area"
              rows={3}
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Capacidade</label>
            <input
              type="number"
              value={form.capacidade}
              onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
              placeholder="Numero de pessoas"
              min="1"
              className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">Abertura</label>
              <input
                type="time"
                value={form.horarioAbertura}
                onChange={(e) => setForm({ ...form, horarioAbertura: e.target.value })}
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-on-surface">Fechamento</label>
              <input
                type="time"
                value={form.horarioFechamento}
                onChange={(e) => setForm({ ...form, horarioFechamento: e.target.value })}
                className="w-full rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativa"
              checked={form.ativa}
              onChange={(e) => setForm({ ...form, ativa: e.target.checked })}
              className="h-4 w-4 rounded accent-primary"
            />
            <label htmlFor="ativa" className="text-sm text-on-surface">Area ativa</label>
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
