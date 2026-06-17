import { useState } from 'react';
import { usuarioService } from '../services/usuarioService';
import { useCrud } from '../services/useCrud';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';

export default function Usuarios() {
    const { usuario: usuarioLogado, isAdmin } = useAuth();

    // Usuário comum não pode listar todos — só admin pode chamar GET /usuarios
    const { items: itemsApi, loading, atualizar, remover } = useCrud(
        usuarioService,
        { entityName: 'usuário', enabled: isAdmin }
    );

    // Se for admin, mostra todos. Se for user comum, mostra só ele mesmo
    const items = isAdmin ? itemsApi : usuarioLogado ? [usuarioLogado] : [];

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'user' });
    const [deleteId, setDeleteId] = useState(null);
    const [saving, setSaving] = useState(false);

    function openEdit(item) {
        setEditingId(item.id);
        setForm({
            nome: item.nome || '',
            email: item.email || '',
            senha: '',
            role: item.role || 'user',
        });
        setModalOpen(true);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        const payload = { nome: form.nome, email: form.email };
        if (form.senha) payload.senha = form.senha;
        if (isAdmin) payload.role = form.role;

        const ok = await atualizar(editingId, payload);
        setSaving(false);
        if (ok) setModalOpen(false);
    }

    async function handleDelete() {
        await remover(deleteId);
        setDeleteId(null);
    }

    // Verifica se o usuário logado pode editar/excluir um item
    function podeEditar(item) {
        return isAdmin || item.id === usuarioLogado?.id;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
                {!isAdmin && (
                    <span className="text-sm text-gray-400">
                        Você pode editar apenas seus próprios dados
                    </span>
                )}
            </div>

            {loading ? (
                <Spinner />
            ) : items.length === 0 ? (
                <p className="text-gray-500">Nenhum usuário encontrado.</p>
            ) : (
                <div className="overflow-x-auto rounded-xl bg-white shadow-lg">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-left text-gray-500">
                                <th className="px-4 py-3">Nome</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Perfil</th>
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {item.nome}
                                        {item.id === usuarioLogado?.id && (
                                            <span className="ml-2 text-xs text-brand-600">(você)</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{item.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold
                      ${item.role === 'admin'
                                                ? 'bg-brand-100 text-brand-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {item.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {podeEditar(item) ? (
                                            <div className="flex justify-end gap-2">
                                                <Button variant="secondary" onClick={() => openEdit(item)}>
                                                    Editar
                                                </Button>
                                                <Button variant="danger" onClick={() => setDeleteId(item.id)}>
                                                    Excluir
                                                </Button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Sem permissão</span>
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
                title="Editar Usuário"
                onClose={() => setModalOpen(false)}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Nome"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Nova senha (opcional)"
                        name="senha"
                        type="password"
                        value={form.senha}
                        onChange={handleChange}
                        placeholder="Deixe em branco para não alterar"
                    />
                    {isAdmin && (
                        <Select
                            label="Perfil"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </Select>
                    )}
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
                title="Excluir usuário"
                message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}