import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  { to: '/carros', title: 'Carros', desc: 'Gerencie o catálogo de carros.', icon: '🚗' },
  { to: '/motos', title: 'Motos', desc: 'Gerencie o catálogo de motos.', icon: '🏍️' },
  { to: '/marcas-roupa', title: 'Marcas de Roupa', desc: 'Gerencie marcas de roupa.', icon: '👕' },
  { to: '/usuarios', title: 'Usuários', desc: 'Gerencie usuários do sistema.', icon: '👤', adminOnly: true },
];

export default function Home() {
  const { usuario, isAdmin } = useAuth();
  const visibleCards = cards.filter((c) => !c.adminOnly || isAdmin);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Olá, {usuario?.nome}!
      </h1>
      <p className="text-gray-500 mb-6">
        Escolha um recurso abaixo para gerenciar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleCards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-shadow flex flex-col gap-2"
          >
            <span className="text-3xl">{card.icon}</span>
            <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
            <p className="text-sm text-gray-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}