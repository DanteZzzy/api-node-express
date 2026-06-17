import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';

export default function Registro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.registro(form.nome, form.email, form.senha, form.role);
      toast.success('Cadastro realizado! Faça login para continuar.');
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.erro ||
        err.response?.data?.erros?.[0]?.msg ||
        'Erro ao cadastrar.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-brand-700 mb-1">Criar conta</h1>
        <p className="text-sm text-gray-500 mb-6">
          Preencha os dados para se cadastrar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            placeholder="Seu nome completo"
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="seuemail@exemplo.com"
          />
          <Input
            label="Senha"
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
          />
          <Select
            label="Tipo de conta"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </Select>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}