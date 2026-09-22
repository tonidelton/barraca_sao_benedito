import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CardapioPage from './pages/CardapioPage';
import EventosPage from './pages/EventosPage';
import LoginPage from './pages/LoginPage';
import ComunidadePage from './pages/ComunidadePage';
import VideosPage from './pages/VideosPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cardapio" element={<CardapioPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/comunidade" element={<ComunidadePage />} />
            <Route path="/videos" element={<VideosPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
