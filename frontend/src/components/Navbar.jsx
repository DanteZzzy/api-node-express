import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const links = [
  { to: '/carros', label: 'Carros' },
  { to: '/motos', label: 'Motos' },
  { to: '/marcas-roupa', label: 'Marcas de Roupa' },
  { to: '/usuarios', label: 'Usuários', adminOnly: true },
];

export default function Navbar() {
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const visibleLinks = links.filter((link) => !link.adminOnly || isAdmin);

  const linkClasses = ({ isActive }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors
     ${isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-brand-50'}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="text-lg font-bold text-brand-700">
            Sistema de Catálogos
          </NavLink>

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-2">
            {visibleLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Usuário + botão sair — desktop */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {usuario?.nome}{' '}
              <span className="text-gray-400">({usuario?.role})</span>
            </span>
            <Button variant="secondary" onClick={handleLogout}>
              Sair
            </Button>
          </div>

          {/* Botão hambúrguer — mobile */}
          <button
            className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile aberto */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClasses}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-600">
                {usuario?.nome} <span className="text-gray-400">({usuario?.role})</span>
              </span>
              <Button variant="secondary" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}