import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, Plus, X, Play, Upload } from 'lucide-react';

export default function VideosPage() {
  const { videos, addVideo, likeVideo, currentUser } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', description: '', url: '', thumbnail: '🎬' });
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const emojis = ['🎬', '🎥', '📹', '🎞️', '📽️', '🎵', '🎤', '🌅', '🏖️', '🍹', '🎉', '🍲', '🐟', '🌊', '☀️'];

  const handleAdd = () => {
    if (!newVideo.title) return;
    addVideo(newVideo.title, newVideo.description, newVideo.url, newVideo.thumbnail);
    setNewVideo({ title: '', description: '', url: '', thumbnail: '🎬' });
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">🎬 Vídeos Curtos</h1>
          <p className="text-pink-100">Barraca de São Benedito - Extrema - MG</p>
          <p className="text-pink-200 text-sm mt-1">Compartilhe e assista momentos especiais da nossa barraca!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Button */}
        {currentUser && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-xl hover:from-pink-600 hover:to-rose-600 transition font-medium shadow-md"
            >
              <Upload size={20} /> Compartilhar Vídeo
            </button>
          </div>
        )}

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Compartilhar Vídeo</h3>
                <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Capa do Vídeo</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {emojis.map(e => (
                      <button key={e} onClick={() => setNewVideo({...newVideo, thumbnail: e})}
                        className={`text-2xl p-1.5 rounded-lg transition ${newVideo.thumbnail === e ? 'bg-pink-100 ring-2 ring-pink-500' : 'hover:bg-gray-100'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <input placeholder="Título do vídeo" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 outline-none" />
                <textarea placeholder="Descrição" value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 outline-none resize-none" rows={2} />
                <input placeholder="URL do vídeo (YouTube, etc.) - opcional" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-pink-500 outline-none" />
                <button onClick={handleAdd} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-bold hover:from-pink-600 hover:to-rose-600 transition">
                  Publicar Vídeo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <div key={video.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-pink-100 group">
              <div
                className="relative bg-gradient-to-br from-pink-100 via-purple-50 to-rose-100 h-52 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
              >
                <span className="text-7xl group-hover:scale-110 transition-transform">{video.thumbnail}</span>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition">
                    <Play size={24} className="text-pink-600 ml-0.5" />
                  </div>
                </div>
                {video.url && (
                  <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    ▶ Vídeo
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{video.description}</p>

                {/* Video Player Area */}
                {playingVideo === video.id && video.url && (
                  <div className="mt-3 rounded-xl overflow-hidden bg-gray-900 aspect-video">
                    <iframe
                      src={video.url}
                      className="w-full h-full"
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                )}
                {playingVideo === video.id && !video.url && (
                  <div className="mt-3 bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-500">
                    📹 Vídeo demonstrativo - URL não disponível
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Por {video.userName}</span>
                  </div>
                  <button
                    onClick={() => likeVideo(video.id)}
                    className="flex items-center gap-1.5 text-pink-500 hover:text-pink-600 transition text-sm font-medium"
                  >
                    <Heart size={16} />
                    {video.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">🎬</p>
            <p className="text-lg">Nenhum vídeo compartilhado ainda</p>
            <p className="text-sm mt-1">Seja o primeiro a compartilhar!</p>
          </div>
        )}
      </div>
    </div>
  );
}
