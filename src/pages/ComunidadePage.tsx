import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Send, Megaphone } from 'lucide-react';

export default function ComunidadePage() {
  const { messages, addMessage, currentUser } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    addMessage(newMessage.trim());
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">💬 Comunidade</h1>
          <p className="text-blue-100">Converse com outros frequentadores e fique por dentro das novidades!</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[60vh] pr-2">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.isAdmin ? 'bg-amber-50 border border-amber-100 rounded-2xl p-4' : ''}`}>
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${msg.isAdmin ? 'bg-amber-200' : 'bg-blue-100'}`}>
                  {msg.userAvatar}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 text-sm">{msg.userName}</span>
                  {msg.isAdmin && (
                    <span className="flex items-center gap-0.5 text-xs bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full font-bold">
                      <Megaphone size={10} /> Admin
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-gray-600 mt-1 text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {currentUser ? (
          <form onSubmit={handleSend} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition pr-12"
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-3.5 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-6 text-center">
            <p className="text-gray-500">🔒 Faça login para participar da conversa</p>
          </div>
        )}
      </div>
    </div>
  );
}
