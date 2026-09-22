import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, Calendar, Clock, Plus, X } from 'lucide-react';

export default function EventosPage() {
  const { events, voteEvent, currentUser, addEvent } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', time: '', image: '🎉' });

  const emojis = ['🎵', '🍻', '🃏', '🏖️', '🎉', '🎸', '🎤', '🎭', '🎪', '🌅', '🎆', '🍖', '🎂', '🏄', '⚽'];
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAdd = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    addEvent({ ...newEvent });
    setNewEvent({ title: '', description: '', date: '', time: '', image: '🎉' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📅 Programação de Eventos</h1>
          <p className="text-purple-100">Vote nos eventos que você quer ver! Os mais votados ganham prioridade.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentUser?.isAdmin && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 transition font-medium shadow-md"
            >
              <Plus size={20} /> Criar Novo Evento
            </button>
          </div>
        )}

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Criar Novo Evento</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ícone do Evento</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {emojis.map(e => (
                      <button key={e} onClick={() => setNewEvent({...newEvent, image: e})}
                        className={`text-2xl p-1.5 rounded-lg transition ${newEvent.image === e ? 'bg-purple-100 ring-2 ring-purple-500' : 'hover:bg-gray-100'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Título do evento" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none" />
                <textarea placeholder="Descrição" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none resize-none" rows={3} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-gray-500">Data</label>
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Horário</label>
                    <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <button onClick={handleAdd} className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition">
                  Criar Evento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sorted.map(event => {
            const hasVoted = currentUser ? event.voters.includes(currentUser.id) : false;
            const eventDate = new Date(event.date + 'T' + event.time);
            const isPast = eventDate < new Date();
            return (
              <div key={event.id} className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border ${isPast ? 'border-gray-200 opacity-60' : 'border-purple-100'}`}>
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 text-center">
                  <span className="text-6xl">{event.image}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xl text-gray-800">{event.title}</h3>
                    {isPast && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Encerrado</span>}
                  </div>
                  <p className="text-gray-500 mt-2">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-purple-600 font-medium">
                      <Calendar size={16} />
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1.5 text-purple-600 font-medium">
                      <Clock size={16} />
                      {event.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => voteEvent(event.id)}
                        disabled={!currentUser}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                          hasVoted
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                        } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Heart size={18} fill={hasVoted ? 'currentColor' : 'none'} />
                        {hasVoted ? 'Votado' : 'Quero ir!'}
                      </button>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">
                      {event.votes} {event.votes === 1 ? 'pessoa quer' : 'pessoas querem'} ir
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📅</p>
            <p className="text-lg">Nenhum evento programado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
