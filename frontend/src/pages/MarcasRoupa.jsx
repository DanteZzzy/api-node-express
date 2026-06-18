import { useState } from 'react';
import { marcaRoupaService } from '../services/nosqlService';
import { useCrud } from '../services/useCrud';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';

const initialForm = { nome: '', pais_origem: '', segmento: '', ano_fundacao: '' };

export default function MarcasRoupa() {
  const toast = useToast();
  const { items, loading, criar, atualizar, remover } = useCrud(marcaRoupaService, { entityName: 'marca de roupa' });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(initialForm);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setForm({
      nome: item.nome || '',
      pais_origem: item.pais_origem || '',
      segmento: item.segmento || '',
      ano_fundacao: item.ano_fundacao || '',
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.nome.trim()) return toast.error('Nome é obrigatório.');
    if (!form.pais_origem.trim()) return toast.error('País de origem é obrigatório.');

    if (form.ano_fundacao) {
      const ano = Number(form.ano_fundacao);
      const anoAtual = new Date().getFullYear();
      if (ano < 1800 || ano > anoAtual) {
        return toast.error(`Ano de fundação inválido. Use um valor entre 1800 e ${anoAtual}.`);
      }
    }

    setSaving(true);
    const payload = {
      nome: form.nome.trim(),
      pais_origem: form.pais_origem.trim(),
      segmento: form.segmento.trim(),
      ano_fundacao: form.ano_fundacao === '' ? undefined : Number(form.ano_fundacao),
    };
    const ok = editingId
      ? await atualizar(editingId, payload)
      : await criar(payload);
    setSaving(false);
    if (ok) setModalOpen(false);
  }

  async function handleDelete() {
    await remover(deleteId);
    setDeleteId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Marcas de Roupa</h1>
        <Button onClick={openCreate}>+ Nova Marca</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <p className="text-gray-500">Nenhuma marca cadastrada ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">País de Origem</th>
                <th className="px-4 py-3">Segmento</th>
                <th className="px-4 py-3">Ano de Fundação</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.nome}</td>
                  <td className="px-4 py-3 text-gray-600">{item.pais_origem}</td>
                  <td className="px-4 py-3 text-gray-600">{item.segmento || '-'}</td>
                  <td className="px-4 py-3 text-gray-600">{item.ano_fundacao || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => openEdit(item)}>
                        Editar
                      </Button>
                      <Button variant="danger" onClick={() => setDeleteId(item._id)}>
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Editar Marca' : 'Nova Marca'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" name="nome" value={form.nome} onChange={handleChange} />
          <Input label="País de Origem" name="pais_origem" value={form.pais_origem} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Segmento" name="segmento" value={form.segmento} onChange={handleChange} />
            <Input label="Ano de Fundação" name="ano_fundacao" type="number" value={form.ano_fundacao} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Excluir marca"
        message="Tem certeza que deseja excluir esta marca? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}