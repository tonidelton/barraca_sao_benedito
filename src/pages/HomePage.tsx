import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UtensilsCrossed, Calendar, MessageCircle, Video, TrendingUp, Star } from 'lucide-react';

export default function HomePage() {
  const { menuItems, events, videos } = useApp();

  const topItems = [...menuItems].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const topEvents = [...events].sort((a, b) => b.votes - a.votes).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌴</div>
          <div className="absolute top-20 right-20 text-6xl">☀️</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">🍹</div>
          <div className="absolute bottom-20 right-1/3 text-5xl">🎵</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              🏖️ Barraca de São Benedito
            </h1>
            <p className="text-sm md:text-base text-amber-200 mb-2 font-medium">📍 Extrema - MG</p>
            <p className="text-xl md:text-2xl text-amber-100 mb-8">
              O melhor da gastronomia com eventos incríveis! Vote nos seus pratos e eventos favoritos.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/cardapio" className="bg-white text-amber-700 font-bold px-8 py-3 rounded-full hover:bg-amber-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Ver Cardápio
              </Link>
              <Link to="/eventos" className="bg-white/20 backdrop-blur text-white font-bold px-8 py-3 rounded-full hover:bg-white/30 transition border border-white/30">
                Próximos Eventos
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/cardapio', icon: UtensilsCrossed, label: 'Cardápio', desc: 'Veja nosso menu', color: 'from-green-500 to-emerald-600' },
            { to: '/eventos', icon: Calendar, label: 'Eventos', desc: 'Programação', color: 'from-purple-500 to-indigo-600' },
            { to: '/comunidade', icon: MessageCircle, label: 'Comunidade', desc: 'Converse conosco', color: 'from-blue-500 to-cyan-600' },
            { to: '/videos', icon: Video, label: 'Vídeos', desc: 'Momentos especiais', color: 'from-pink-500 to-rose-600' },
          ].map(link => (
            <Link key={link.to} to={link.to} className="group">
              <div className={`bg-gradient-to-br ${link.color} text-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1`}>
                <link.icon size={28} className="mb-2" />
                <h3 className="font-bold text-lg">{link.label}</h3>
                <p className="text-sm opacity-80">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Voted Items */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="text-amber-600" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Mais Votados do Cardápio</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {topItems.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-amber-100 relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Star size={12} /> #{idx + 1}
              </div>
              <div className="text-5xl mb-4">{item.image}</div>
              <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-amber-600 font-bold text-lg">R$ {item.price.toFixed(2)}</span>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                  ❤️ {item.votes} votos
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/cardapio" className="text-amber-600 hover:text-amber-700 font-medium hover:underline">
            Ver cardápio completo →
          </Link>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="text-purple-600" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Próximos Eventos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {topEvents.map(event => (
              <div key={event.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{event.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-purple-600 text-sm font-medium">📅 {new Date(event.date).toLocaleDateString('pt-BR')}</span>
                      <span className="text-purple-600 text-sm font-medium">🕐 {event.time}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        ❤️ {event.votes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/eventos" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
              Ver todos os eventos →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Video className="text-pink-600" size={28} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Vídeos Recentes</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {videos.slice(0, 3).map(video => (
            <div key={video.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-pink-100">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 h-40 flex items-center justify-center text-6xl">
                {video.thumbnail}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{video.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{video.description}</p>
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <span>Por {video.userName}</span>
                  <span>❤️ {video.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/videos" className="text-pink-600 hover:text-pink-700 font-medium hover:underline">
            Ver todos os vídeos →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-2xl mb-2">🏖️</p>
          <p className="font-bold text-white text-lg">Barraca de São Benedito</p>
          <p className="text-sm mt-2">📍 Extrema - MG</p>
          <p className="text-xs mt-4">© 2026 Barraca de São Benedito - Extrema - MG. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
