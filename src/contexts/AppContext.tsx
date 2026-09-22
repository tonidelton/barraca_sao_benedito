import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  votes: number;
  voters: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  image: string;
  votes: number;
  voters: string[];
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  userId: string;
  userName: string;
  timestamp: string;
  likes: number;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  menuItems: MenuItem[];
  events: Event[];
  messages: Message[];
  videos: Video[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  voteMenuItem: (itemId: string) => void;
  voteEvent: (eventId: string) => void;
  addMessage: (content: string) => void;
  addVideo: (title: string, description: string, url: string, thumbnail: string) => void;
  likeVideo: (videoId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'votes' | 'voters'>) => void;
  addEvent: (event: Omit<Event, 'id' | 'votes' | 'voters'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultMenuItems: MenuItem[] = [
  { id: '1', name: 'Porção de Camarão', description: 'Camarão empanado crocante com molho tártaro especial', price: 45.90, category: 'Porções', image: '🍤', votes: 12, voters: [] },
  { id: '2', name: 'Peixe Frito', description: 'Filé de peixe fresco frito na hora com limão', price: 38.90, category: 'Pratos', image: '🐟', votes: 8, voters: [] },
  { id: '3', name: 'Caipirinha Clássica', description: 'Cachaça artesanal, limão, açúcar e gelo', price: 18.90, category: 'Bebidas', image: '🍹', votes: 25, voters: [] },
  { id: '4', name: 'Coco Gelado', description: 'Água de coco natural gelada direto do coco', price: 8.90, category: 'Bebidas', image: '🥥', votes: 15, voters: [] },
  { id: '5', name: 'Moqueca de Peixe', description: 'Moqueca baiana com peixe fresco, dendê e leite de coco', price: 55.90, category: 'Pratos', image: '🍲', votes: 18, voters: [] },
  { id: '6', name: 'Espetinho de Camarão', description: 'Espetinhos grelhados com molho especial da casa', price: 32.90, category: 'Porções', image: '🍢', votes: 10, voters: [] },
  { id: '7', name: 'Açaí na Tigela', description: 'Açaí cremoso com granola, banana e mel', price: 22.90, category: 'Sobremesas', image: '🍇', votes: 20, voters: [] },
  { id: '8', name: 'Água de Coco', description: 'Coco verde natural gelado', price: 7.90, category: 'Bebidas', image: '🌴', votes: 9, voters: [] },
];

const defaultEvents: Event[] = [
  { id: '1', title: 'Noite de Samba', description: 'Venha curtir o melhor do samba com nosso grupo ao vivo! Cerveja gelada e muita animação.', date: '2026-02-15', time: '19:00', image: '🎵', votes: 30, voters: [] },
  { id: '2', title: 'Happy Hour Sexta', description: 'Drinks com 50% de desconto das 17h às 20h. Traga seus amigos!', date: '2026-02-14', time: '17:00', image: '🍻', votes: 22, voters: [] },
  { id: '3', title: 'Torneio de Truco', description: 'Competição valendo prêmios! Inscrições no local.', date: '2026-02-20', time: '15:00', image: '🃏', votes: 15, voters: [] },
  { id: '4', title: 'Luau na Praia', description: 'Noite especial com fogueira, violão e petiscos especiais.', date: '2026-02-22', time: '20:00', image: '🏖️', votes: 28, voters: [] },
];

const defaultMessages: Message[] = [
  { id: '1', userId: 'admin', userName: 'Admin', userAvatar: '👨‍💼', content: 'Bem-vindos à Barraca do Sabor! 🎉 Novos pratos no cardápio essa semana!', timestamp: '2026-02-10T10:00:00', isAdmin: true },
  { id: '2', userId: '2', userName: 'Maria', userAvatar: '👩', content: 'A caipirinha de lá está incrível! Super recomendo!', timestamp: '2026-02-10T11:30:00', isAdmin: false },
  { id: '3', userId: '3', userName: 'João', userAvatar: '👨', content: 'Alguém vai no luau de sábado?', timestamp: '2026-02-10T14:00:00', isAdmin: false },
];

const defaultVideos: Video[] = [
  { id: '1', title: 'Preparo da Moqueca', description: 'Veja como preparamos nossa famosa moqueca!', url: '', thumbnail: '🍲', userId: 'admin', userName: 'Admin', timestamp: '2026-02-09T12:00:00', likes: 15 },
  { id: '2', title: 'Happy Hour de Ontem', description: 'Momentos incríveis do nosso happy hour!', url: '', thumbnail: '🎉', userId: '2', userName: 'Maria', timestamp: '2026-02-08T20:00:00', likes: 22 },
  { id: '3', title: 'Pôr do Sol na Barraca', description: 'A vista mais linda da região!', url: '', thumbnail: '🌅', userId: '3', userName: 'João', timestamp: '2026-02-07T18:30:00', likes: 30 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [
      { id: 'admin', name: 'Admin', email: 'admin@barraca.com', password: 'admin123', avatar: '👨‍💼', isAdmin: true, createdAt: '2026-01-01' }
    ];
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : defaultMenuItems;
  });

  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });

  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('videos');
    return saved ? JSON.parse(saved) : defaultVideos;
  });

  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('menuItems', JSON.stringify(menuItems)); }, [menuItems]);
  useEffect(() => { localStorage.setItem('events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); return true; }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: Date.now().toString(),
      name, email, password,
      avatar: ['👤', '👩', '👨', '🧑', '👱'][Math.floor(Math.random() * 5)],
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => setCurrentUser(null);

  const voteMenuItem = (itemId: string) => {
    if (!currentUser) return;
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasVoted = item.voters.includes(currentUser.id);
        return {
          ...item,
          votes: hasVoted ? item.votes - 1 : item.votes + 1,
          voters: hasVoted ? item.voters.filter(v => v !== currentUser.id) : [...item.voters, currentUser.id]
        };
      }
      return item;
    }));
  };

  const voteEvent = (eventId: string) => {
    if (!currentUser) return;
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        const hasVoted = event.voters.includes(currentUser.id);
        return {
          ...event,
          votes: hasVoted ? event.votes - 1 : event.votes + 1,
          voters: hasVoted ? event.voters.filter(v => v !== currentUser.id) : [...event.voters, currentUser.id]
        };
      }
      return event;
    }));
  };

  const addMessage = (content: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      isAdmin: currentUser.isAdmin
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const addVideo = (title: string, description: string, url: string, thumbnail: string) => {
    if (!currentUser) return;
    const newVideo: Video = {
      id: Date.now().toString(),
      title, description, url, thumbnail,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    setVideos(prev => [newVideo, ...prev]);
  };

  const likeVideo = (videoId: string) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, likes: v.likes + 1 } : v));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id' | 'votes' | 'voters'>) => {
    const newItem: MenuItem = { ...item, id: Date.now().toString(), votes: 0, voters: [] };
    setMenuItems(prev => [...prev, newItem]);
  };

  const addEvent = (event: Omit<Event, 'id' | 'votes' | 'voters'>) => {
    const newEvent: Event = { ...event, id: Date.now().toString(), votes: 0, voters: [] };
    setEvents(prev => [...prev, newEvent]);
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, menuItems, events, messages, videos,
      login, register, logout, voteMenuItem, voteEvent,
      addMessage, addVideo, likeVideo, addMenuItem, addEvent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
