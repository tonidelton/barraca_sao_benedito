import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Menu, X, Home, UtensilsCrossed, Calendar, MessageCircle, Video, User, LogOut, LogIn, Shield } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useApp();
  const location = useLocation();

  const links = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/cardapio', icon: UtensilsCrossed, label: 'Cardápio' },
    { to: '/eventos', icon: Calendar, label: 'Eventos' },
    { to: '/comunidade', icon: MessageCircle, label: 'Comunidade' },
    { to: '/videos', icon: Video, label: 'Vídeos' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-3xl">🏖️</span>
            <span className="hidden sm:inline">Barraca de São Benedito</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to) ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-300/30 text-yellow-100 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-400/30 transition">
                    <Shield size={16} />
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                  <span className="text-lg">{currentUser.avatar}</span>
                  <span className="text-sm font-medium">{currentUser.name}</span>
                  {currentUser.isAdmin && <span className="text-xs bg-yellow-300 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">ADM</span>}
                </div>
                <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg transition" title="Sair">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition">
                <LogIn size={18} />
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-amber-700/95 backdrop-blur-sm border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.to) ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              {currentUser ? (
                <>
                  {currentUser.isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-yellow-400/20 border border-yellow-300/30 text-yellow-100 font-medium text-sm mb-2">
                      <Shield size={18} /> Painel Admin
                    </Link>
                  )}
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentUser.avatar}</span>
                      <span className="font-medium">{currentUser.name}</span>
                    </div>
                    <button onClick={logout} className="flex items-center gap-1 text-sm text-red-200 hover:text-red-100">
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-white/10">
                  <User size={20} /> Entrar / Cadastrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
