import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, Search, Filter, Plus, X } from 'lucide-react';

export default function CardapioPage() {
  const { menuItems, voteMenuItem, currentUser, addMenuItem } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' });

  const categories = ['Todos', ...Array.from(new Set(menuItems.map(i => i.category)))];
  const emojis = ['🍽️', '🍤', '🐟', '🍹', '🥥', '🍲', '🍢', '🍇', '🌴', '🍺', '🥗', '🍔', '🌮', '🍕', '🍦'];

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || item.category === category;
    return matchSearch && matchCat;
  });

  const sorted = [...filtered].sort((a, b) => b.votes - a.votes);

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    addMenuItem({
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
      category: newItem.category,
      image: newItem.image
    });
    setNewItem({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🍽️ Cardápio Virtual</h1>
          <p className="text-green-100">Vote nos seus pratos favoritos e ajude a montar nosso menu!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar no cardápio..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {currentUser?.isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition font-medium"
            >
              <Plus size={20} /> Adicionar Item
            </button>
          )}
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Adicionar Item ao Cardápio</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Emoji do Item</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {emojis.map(e => (
                      <button key={e} onClick={() => setNewItem({...newItem, image: e})}
                        className={`text-2xl p-1.5 rounded-lg transition ${newItem.image === e ? 'bg-green-100 ring-2 ring-green-500' : 'hover:bg-gray-100'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Nome do item" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none" />
                <textarea placeholder="Descrição" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none resize-none" rows={2} />
                <input placeholder="Preço (ex: 25.90)" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none" />
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-green-500 outline-none">
                  <option>Porções</option><option>Pratos</option><option>Bebidas</option><option>Sobremesas</option>
                </select>
                <button onClick={handleAdd} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
                  Adicionar ao Cardápio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(item => {
            const hasVoted = currentUser ? item.voters.includes(currentUser.id) : false;
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100 group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center group-hover:scale-105 transition-transform">
                  <span className="text-5xl">{item.image}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-green-600 font-bold text-xl">R$ {item.price.toFixed(2)}</span>
                    <button
                      onClick={() => voteMenuItem(item.id)}
                      disabled={!currentUser}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        hasVoted
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={!currentUser ? 'Faça login para votar' : hasVoted ? 'Remover voto' : 'Votar'}
                    >
                      <Heart size={16} fill={hasVoted ? 'currentColor' : 'none'} />
                      {item.votes}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg">Nenhum item encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
