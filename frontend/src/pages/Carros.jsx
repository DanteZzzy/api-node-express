import { useState } from 'react';
import { carroService } from '../services/nosqlService';
import { useCrud } from '../services/useCrud';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';

const initialForm = { marca: '', modelo: '', ano: '', cor: '', preco: '' };

export default function Carros() {
  const toast = useToast();
  const { isAdmin } = useAuth();
  const { items, loading, criar, atualizar, remover } = useCrud(carroService, { entityName: 'carro' });

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
      marca: item.marca || '',
      modelo: item.modelo || '',
      ano: item.ano || '',
      cor: item.cor || '',
      preco: item.preco ?? '',
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.marca.trim()) return toast.error('Marca é obrigatória.');
    if (!form.modelo.trim()) return toast.error('Modelo é obrigatório.');
    if (!form.ano) return toast.error('Ano é obrigatório.');
    if (!form.cor.trim()) return toast.error('Cor é obrigatória.');

    const ano = Number(form.ano);
    const anoAtual = new Date().getFullYear();
    if (ano < 1886 || ano > anoAtual + 1) {
      return toast.error(`Ano inválido. Use um valor entre 1886 e ${anoAtual + 1}.`);
    }

    setSaving(true);
    const payload = {
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      ano,
      cor: form.cor.trim(),
      preco: form.preco === '' ? undefined : Number(form.preco),
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
        <h1 className="text-2xl font-bold text-gray-900">Carros</h1>
        {isAdmin && <Button onClick={openCreate}>+ Novo Carro</Button>}
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <p className="text-gray-500">Nenhum carro cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-4 py-3">Marca</th>
                <th className="px-4 py-3">Modelo</th>
                <th className="px-4 py-3">Ano</th>
                <th className="px-4 py-3">Cor</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.marca}</td>
                  <td className="px-4 py-3 text-gray-600">{item.modelo}</td>
                  <td className="px-4 py-3 text-gray-600">{item.ano}</td>
                  <td className="px-4 py-3 text-gray-600">{item.cor}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.preco != null
                      ? `R$ ${Number(item.preco).toLocaleString('pt-BR')}`
                      : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isAdmin ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(item)}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => setDeleteId(item._id)}>
                          Excluir
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Somente leitura</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editingId ? 'Editar Carro' : 'Novo Carro'}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Marca" name="marca" value={form.marca} onChange={handleChange} />
          <Input label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Ano" name="ano" type="number" value={form.ano} onChange={handleChange} />
            <Input label="Cor" name="cor" value={form.cor} onChange={handleChange} />
          </div>
          <Input label="Preço (R$)" name="preco" type="number" step="0.01" value={form.preco} onChange={handleChange} />
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
        title="Excluir carro"
        message="Tem certeza que deseja excluir este carro? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}