import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, senha);
      toast.success('Login realizado com sucesso!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao realizar login.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-brand-700 mb-1">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Entre com sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seuemail@exemplo.com"
          />
          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Não tem uma conta?{' '}
          <Link to="/registro" className="text-brand-600 font-semibold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}