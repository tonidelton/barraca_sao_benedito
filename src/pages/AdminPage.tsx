import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Navigate } from 'react-router-dom';
import {
  UtensilsCrossed, Calendar, Video, MessageCircle, Plus, Edit3, Trash2,
  X, Save, Megaphone, Users, TrendingUp, BarChart3, Settings, Shield
} from 'lucide-react';

type Tab = 'dashboard' | 'cardapio' | 'eventos' | 'videos' | 'comunicados';

export default function AdminPage() {
  const {
    currentUser, menuItems, events, videos, messages, users,
    addMenuItem, updateMenuItem, deleteMenuItem,
    addEvent, updateEvent, deleteEvent,
    deleteVideo, broadcastMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  // Form states
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' });
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', image: '🎉' });
  const [broadcast, setBroadcast] = useState('');

  const emojis = ['🍽️', '🍤', '🐟', '🍹', '🥥', '🍲', '🍢', '🍇', '🌴', '🍺', '🥗', '🍔', '🌮', '🍕', '🍦', '🎵', '🍻', '🃏', '🏖️', '🎉', '🎸', '🎤', '🎭', '🎪', '🌅', '🎆', '🍖', '🎂', '🏄', '⚽'];

  if (!currentUser?.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleAddMenuItem = () => {
    if (!menuForm.name || !menuForm.price) return;
    addMenuItem({
      name: menuForm.name,
      description: menuForm.description,
      price: parseFloat(menuForm.price),
      category: menuForm.category,
      image: menuForm.image
    });
    setMenuForm({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' });
    setShowAddMenu(false);
  };

  const handleUpdateMenuItem = (id: string) => {
    updateMenuItem(id, {
      name: menuForm.name,
      description: menuForm.description,
      price: parseFloat(menuForm.price),
      category: menuForm.category,
      image: menuForm.image
    });
    setEditingItem(null);
    setMenuForm({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' });
  };

  const startEditMenu = (id: string) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image
    });
    setEditingItem(id);
    setShowAddMenu(false);
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time) return;
    addEvent({ ...eventForm });
    setEventForm({ title: '', description: '', date: '', time: '', image: '🎉' });
    setShowAddEvent(false);
  };

  const handleUpdateEvent = (id: string) => {
    updateEvent(id, { ...eventForm });
    setEditingItem(null);
    setEventForm({ title: '', description: '', date: '', time: '', image: '🎉' });
  };

  const startEditEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      image: event.image
    });
    setEditingItem(id);
    setShowAddEvent(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'menu') deleteMenuItem(confirmDelete.id);
    if (confirmDelete.type === 'event') deleteEvent(confirmDelete.id);
    if (confirmDelete.type === 'video') deleteVideo(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleBroadcast = () => {
    if (!broadcast.trim()) return;
    broadcastMessage(broadcast.trim());
    setBroadcast('');
  };

  const tabs = [
    { id: 'dashboard' as Tab, icon: BarChart3, label: 'Dashboard' },
    { id: 'cardapio' as Tab, icon: UtensilsCrossed, label: 'Cardápio' },
    { id: 'eventos' as Tab, icon: Calendar, label: 'Eventos' },
    { id: 'videos' as Tab, icon: Video, label: 'Vídeos' },
    { id: 'comunicados' as Tab, icon: Megaphone, label: 'Comunicados' },
  ];

  const totalVotesMenu = menuItems.reduce((sum, i) => sum + i.votes, 0);
  const totalVotesEvents = events.reduce((sum, e) => sum + e.votes, 0);
  const topMenuItem = [...menuItems].sort((a, b) => b.votes - a.votes)[0];
  const topEvent = [...events].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Painel Administrativo</h1>
              <p className="text-gray-300 text-sm">Barraca de São Benedito - Extrema - MG</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2.5 rounded-lg"><UtensilsCrossed size={20} className="text-green-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{menuItems.length}</p>
                    <p className="text-xs text-gray-500">Itens no Cardápio</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2.5 rounded-lg"><Calendar size={20} className="text-purple-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                    <p className="text-xs text-gray-500">Eventos</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2.5 rounded-lg"><Users size={20} className="text-blue-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                    <p className="text-xs text-gray-500">Usuários</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-2.5 rounded-lg"><Video size={20} className="text-pink-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{videos.length}</p>
                    <p className="text-xs text-gray-500">Vídeos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-amber-500" />
                  <h3 className="font-bold text-gray-800">Engajamento</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de votos no cardápio</span>
                    <span className="font-bold text-green-600">{totalVotesMenu}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total de votos em eventos</span>
                    <span className="font-bold text-purple-600">{totalVotesEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mensagens na comunidade</span>
                    <span className="font-bold text-blue-600">{messages.length}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Settings size={20} className="text-amber-500" />
                  <h3 className="font-bold text-gray-800">Destaques</h3>
                </div>
                <div className="space-y-3">
                  {topMenuItem && (
                    <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                      <span className="text-2xl">{topMenuItem.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{topMenuItem.name}</p>
                        <p className="text-xs text-gray-500">Mais votado do cardápio ({topMenuItem.votes} votos)</p>
                      </div>
                    </div>
                  )}
                  {topEvent && (
                    <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-lg">
                      <span className="text-2xl">{topEvent.image}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{topEvent.title}</p>
                        <p className="text-xs text-gray-500">Evento mais popular ({topEvent.votes} votos)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cardápio Management */}
        {activeTab === 'cardapio' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Gerenciar Cardápio</h2>
              <button onClick={() => { setShowAddMenu(true); setEditingItem(null); setMenuForm({ name: '', description: '', price: '', category: 'Porções', image: '🍽️' }); }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm">
                <Plus size={18} /> Novo Item
              </button>
            </div>

            {/* Add/Edit Form */}
            {(showAddMenu || editingItem) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">{editingItem ? 'Editar Item' : 'Novo Item'}</h3>
                  <button onClick={() => { setShowAddMenu(false); setEditingItem(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Emoji</label>
                    <div className="flex flex-wrap gap-1.5">
                      {emojis.slice(0, 15).map(e => (
                        <button key={e} onClick={() => setMenuForm({...menuForm, image: e})}
                          className={`text-xl p-1 rounded transition ${menuForm.image === e ? 'bg-green-100 ring-2 ring-green-500' : 'hover:bg-gray-100'}`}>{e}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Nome</label>
                    <input value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="Nome do item" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Descrição</label>
                    <textarea value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm resize-none" rows={2} placeholder="Descrição" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Preço (R$)</label>
                    <input type="number" step="0.01" value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Categoria</label>
                    <select value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-green-500 outline-none text-sm">
                      <option>Porções</option><option>Pratos</option><option>Bebidas</option><option>Sobremesas</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => editingItem ? handleUpdateMenuItem(editingItem) : handleAddMenuItem()}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition font-medium text-sm">
                    <Save size={16} /> {editingItem ? 'Salvar Alterações' : 'Adicionar'}
                  </button>
                  <button onClick={() => { setShowAddMenu(false); setEditingItem(null); }}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm">Cancelar</button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Item</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Categoria</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Preço</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Votos</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {menuItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.image}</span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{item.category}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-green-600 text-sm">R$ {item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{item.votes} ❤️</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEditMenu(item.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => setConfirmDelete({ type: 'menu', id: item.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Eventos Management */}
        {activeTab === 'eventos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Gerenciar Eventos</h2>
              <button onClick={() => { setShowAddEvent(true); setEditingItem(null); setEventForm({ title: '', description: '', date: '', time: '', image: '🎉' }); }}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium text-sm">
                <Plus size={18} /> Novo Evento
              </button>
            </div>

            {(showAddEvent || editingItem) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">{editingItem ? 'Editar Evento' : 'Novo Evento'}</h3>
                  <button onClick={() => { setShowAddEvent(false); setEditingItem(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Emoji</label>
                    <div className="flex flex-wrap gap-1.5">
                      {emojis.slice(15).map(e => (
                        <button key={e} onClick={() => setEventForm({...eventForm, image: e})}
                          className={`text-xl p-1 rounded transition ${eventForm.image === e ? 'bg-purple-100 ring-2 ring-purple-500' : 'hover:bg-gray-100'}`}>{e}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Título</label>
                    <input value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm" placeholder="Título do evento" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Descrição</label>
                    <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm resize-none" rows={2} placeholder="Descrição" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Data</label>
                    <input type="date" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Horário</label>
                    <input type="time" value={eventForm.time} onChange={e => setEventForm({...eventForm, time: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-500 outline-none text-sm" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => editingItem ? handleUpdateEvent(editingItem) : handleAddEvent()}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition font-medium text-sm">
                    <Save size={16} /> {editingItem ? 'Salvar Alterações' : 'Criar Evento'}
                  </button>
                  <button onClick={() => { setShowAddEvent(false); setEditingItem(null); }}
                    className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm">Cancelar</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Evento</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Data/Hora</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Votos</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{event.image}</span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{event.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                          {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {event.time}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{event.votes} ❤️</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEditEvent(event.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Editar">
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => setConfirmDelete({ type: 'event', id: event.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Videos Management */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Gerenciar Vídeos</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Vídeo</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Autor</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Likes</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {videos.map(video => (
                      <tr key={video.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{video.thumbnail}</span>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{video.title}</p>
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{video.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{video.userName}</td>
                        <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{video.likes} ❤️</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end">
                            <button onClick={() => setConfirmDelete({ type: 'video', id: video.id })}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Excluir">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {videos.length === 0 && (
                <div className="p-8 text-center text-gray-400">Nenhum vídeo encontrado</div>
              )}
            </div>
          </div>
        )}

        {/* Comunicados */}
        {activeTab === 'comunicados' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Enviar Comunicados</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500 mb-4">
                Envie uma mensagem que aparecerá na comunidade com o selo de <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">Admin</span>
              </p>
              <textarea
                value={broadcast}
                onChange={e => setBroadcast(e.target.value)}
                placeholder="Digite seu comunicado para todos os usuários..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none text-sm"
                rows={4}
              />
              <button onClick={handleBroadcast}
                className="mt-3 flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600 transition font-medium text-sm">
                <Megaphone size={16} /> Enviar Comunicado
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Mensagens Recentes</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {messages.slice().reverse().map(msg => (
                  <div key={msg.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{msg.userAvatar}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-800">{msg.userName}</span>
                            {msg.isAdmin && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Admin</span>}
                            <span className="text-xs text-gray-400">{new Date(msg.timestamp).toLocaleString('pt-BR')}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center">
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-500 mb-6">Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium text-sm">
                  Cancelar
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium text-sm">
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
