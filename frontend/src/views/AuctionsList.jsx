import React, { useState, useEffect } from 'react';
import {
  Compass, Timer, MessageSquare, ShoppingCart, User, Bell, Heart, LogOut,
  Shield, Cpu, Grid, List, Search, ArrowRight, Gavel, X, Check, Landmark, Zap
} from 'lucide-react';

function AuctionsList({ user, onLogout, onSelectAuction, onNavigate }) {
  // Liste des véhicules aux enchères uniquement
  const initialAuctions = [
    {
      id: 1,
      brand: 'Nissan',
      model: 'Skyline R34 GT-R V-Spec',
      year: 1999,
      price: 185000,
      mileage: 42000,
      chassis: 'BNR34-001245',
      engine: 'RB26DETT',
      power: '276 ch (Est.)',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYHi8qgkPyuiftrZVdjQQwE4Eh7S158JuDGf2KJyFbAw4_KWz5d4jb56mQAqWwjei9durzUYfFKGEcqwY7tRbAFsG2V9SdRFM8_yOmMtdP-yeB2RSFav-20zapB5A2-eLNo1kVnIqHo-POlbW5KxaxTogcAEnl5734j-HI8ydyidVNsbUvFB2exBJWtgnyc4OqLMPJ3rvxKyXWl7HL8f0q8XDTPtQi4fVT27C-2shtfJlBWkwwnE48FdyHlVzDv4IJCqDPhX9qVpuS',
      category: 'Voitures JDM',
      status: 'Enchère en Cours',
      saleType: 'auction',
      verified: true,
      timeLeft: 14500 // Fictif : ~4 heures
    },
    {
      id: 5,
      brand: 'Honda',
      model: 'NSX-R NA2',
      year: 2002,
      price: 220000,
      mileage: 24000,
      chassis: 'NA2-100234',
      engine: 'C32B V6',
      power: '290 ch',
      image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80',
      category: 'Voitures JDM',
      status: 'Enchère en Cours',
      saleType: 'auction',
      verified: true,
      timeLeft: 25200 // Fictif : ~7 heures
    }
  ];

  const [auctions, setAuctions] = useState(initialAuctions);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // États de Panier, Favoris & Menus déroulants (pour garder le Header fonctionnel)
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([1]);
  const [showCartMenu, setShowCartMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Enchère Skyline R34 dépassée par takumi_86", time: "Il y a 10 min", read: false },
    { id: 2, text: "Nouveau message de Keiichi Tsuchiya", time: "Il y a 2 heures", read: false },
    { id: 3, text: "Entiercement validé pour Jantes GP 18\"", time: "Hier", read: true }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, sender: "Takumi Fujiwara", snippet: "Le turbo HKS est encore dispo ?", time: "18:42", online: true },
    { id: 2, sender: "Keiichi Tsuchiya", snippet: "Je pose une offre sur ta R34.", time: "15:20", online: false }
  ]);

  // Compte à rebours animé pour l'affichage esthétique
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTicks(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (initialSeconds, elapsed) => {
    const remaining = Math.max(0, initialSeconds - elapsed);
    const h = Math.floor(remaining / 3600).toString().padStart(2, '0');
    const m = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    return `${h}h ${m}m ${s}s`;
  };

  const handleReadNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
  };

  const filteredAuctions = auctions.filter(item => 
    item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.chassis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Gradients lumineux néons en arrière-plan */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Barre de navigation */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.15)]">
        <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">

          {/* Logo & Titre */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded bg-[#bb86fc] flex items-center justify-center font-black tracking-tighter text-[#460283] italic text-lg shadow-[0_0_12px_rgba(187,134,252,0.4)]">
              MN
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
              <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
            </div>
          </div>

          {/* Onglets Principaux */}
          <div className="hidden lg:flex gap-8 items-center font-semibold text-sm">
            <button 
              onClick={() => onNavigate('home')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 cursor-pointer font-semibold text-sm bg-transparent border-none"
            >
              Catalogue
            </button>
            <button 
              onClick={() => onNavigate('auctions_list')}
              className="text-[#bb86fc] border-b-2 border-[#bb86fc] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Enchères
            </button>
            <button 
              onClick={() => alert("Espace Préparations bientôt disponible (Gabin / Préparations)")}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] pb-1 cursor-pointer transition-colors bg-transparent border-none font-semibold text-sm"
            >
              Préparations
            </button>
          </div>

          {/* Recherche & Icônes d'action */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Input de Recherche */}
            <div className="relative group input-glow border border-white/10 rounded-lg bg-[#1c1b1b] transition-all duration-300 w-44 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#cdc3d4] w-4.5 h-4.5" />
              <input
                className="w-full bg-transparent border-none text-[#e5e2e1] font-mono text-xs pl-10 pr-4 py-2.5 focus:outline-none focus:ring-0 placeholder-[#cdc3d4]/30"
                placeholder="Filtrer les enchères live..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2.5">
              
              {/* Menu Déroulant Notifications */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotificationsMenu(!showNotificationsMenu); setShowMessagesMenu(false); setShowCartMenu(false); setShowProfileMenu(false); }}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showNotificationsMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(187,134,252,0.6)]"></span>
                </button>

                {showNotificationsMenu && (
                  <>
                    <div onClick={() => setShowNotificationsMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Flux Réseau</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleReadNotification(n.id)}
                            className={`px-4 py-3 hover:bg-white/5 transition-all relative cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                            <p className="text-xs text-zinc-200 pl-1">{n.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Menu Déroulant Messagerie */}
              <div className="relative">
                <button 
                  onClick={() => { setShowMessagesMenu(!showMessagesMenu); setShowNotificationsMenu(false); setShowCartMenu(false); setShowProfileMenu(false); }}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showMessagesMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                >
                  <MessageSquare size={20} />
                </button>
              </div>

              {/* Menu Déroulant Panier */}
              <div className="relative">
                <button 
                  onClick={() => { setShowCartMenu(!showCartMenu); setShowNotificationsMenu(false); setShowMessagesMenu(false); setShowProfileMenu(false); }}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showCartMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                >
                  <ShoppingCart size={20} />
                </button>
              </div>

              {/* Profil */}
              <div className="relative">
                <button 
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotificationsMenu(false); setShowMessagesMenu(false); setShowCartMenu(false); }}
                  className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${
                    showProfileMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                >
                  <User size={20} />
                </button>

                {showProfileMenu && (
                  <>
                    <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40">
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                        <span className="text-zinc-200 truncate block">{user?.email}</span>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[8px] font-bold uppercase tracking-wider">
                          {user?.role === 'admin' ? '🛡️ Admin' : '👤 Client'}
                        </span>
                      </div>
                      <button 
                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut size={14} />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header Section (Extremement attractive) */}
      <header className="max-w-[1440px] mx-auto px-4 md:px-16 pt-8 pb-12 relative z-10 text-center">
        {/* Neon light background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[120%] bg-[#bb86fc]/5 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2.5 bg-[#ffb2bc]/10 border border-[#ffb2bc]/30 px-4 py-1.5 rounded-full text-xs text-[#ffb2bc] mb-2 uppercase tracking-widest font-mono animate-pulse">
            <Timer size={14} className="text-secondary" />
            <span>Salle des Ventes Underground Active</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter uppercase text-zinc-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            LES ENCHÈRES <span className="text-[#bb86fc] drop-shadow-[0_0_20px_rgba(187,134,252,0.4)]">DE MINUIT</span>
          </h1>
          
          <p className="text-xs sm:text-sm text-[#cdc3d4]/75 max-w-xl mx-auto font-mono leading-relaxed">
            Moteurs gonflés, carrosseries pures, châssis certifiés. Affrontez les meilleurs pilotes underground sous la surveillance stricte du syndicat.
          </p>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 pb-24 relative z-10">
        
        {/* Controls Bar */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
          <div>
            <span className="text-xs text-zinc-500 font-mono">Affichage : <strong>{filteredAuctions.length} bolides en cours</strong></span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded border cursor-pointer transition-all ${
                viewMode === 'grid' ? 'border-[#bb86fc] text-[#bb86fc] bg-[#bb86fc]/5' : 'border-white/10 text-zinc-400'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded border cursor-pointer transition-all ${
                viewMode === 'list' ? 'border-[#bb86fc] text-[#bb86fc] bg-[#bb86fc]/5' : 'border-white/10 text-zinc-400'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Auctions Cards */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 gap-8" 
          : "space-y-6"
        }>
          {filteredAuctions.map(product => (
            <div 
              key={product.id}
              className={`glass-panel rounded-3xl overflow-hidden group hover:border-[#bb86fc]/30 hover:neon-glow-primary transition-all duration-500 border border-white/5 flex flex-col relative bg-[#1c1b1b]/55 ${
                viewMode === 'list' ? 'md:flex-row' : ''
              }`}
            >
              {/* LED Decor */}
              <span className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
              
              {/* Image Section */}
              <div className={`relative overflow-hidden bg-[#2a2a2a] ${
                viewMode === 'list' ? 'h-52 md:w-80 md:h-full flex-shrink-0' : 'h-64 w-full'
              }`}>
                <img 
                  src={product.image} 
                  alt={product.model} 
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/10 to-transparent"></div>
                
                {/* Flashing Live Badge */}
                <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-[#ffb2bc] text-[#400013] px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_12px_rgba(255,178,188,0.4)] border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#400013] animate-pulse"></span>
                  <span>LIVE</span>
                </div>
              </div>

              {/* Data Section */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[#ffb2bc] text-[10px] font-mono uppercase tracking-widest font-bold">{product.brand}</span>
                      <h3 className="text-xl sm:text-2xl font-black italic tracking-tighter uppercase text-zinc-100 group-hover:text-[#dab9ff] transition-colors mt-0.5">
                        {product.year} {product.model}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#cdc3d4]/30 font-mono block">OFFRE DU SYNDICAT</span>
                      <span className="font-extrabold text-[#17deca] text-lg font-mono tracking-tight block">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Specs Table */}
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-4 font-mono text-[11px] text-[#cdc3d4]/65">
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase tracking-wider mb-0.5">CODE BLOC</span>
                      <span className="font-bold text-zinc-300">{product.engine}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase tracking-wider mb-0.5">KILOMÉTRAGE</span>
                      <span className="font-bold text-zinc-300">{product.mileage.toLocaleString()} km</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase tracking-wider mb-0.5">CHÂSSIS</span>
                      <span className="font-bold text-zinc-300 truncate block max-w-[130px]">{product.chassis}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block text-[9px] uppercase tracking-wider mb-0.5">PUISSANCE (EST.)</span>
                      <span className="font-bold text-zinc-300">{product.power}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex justify-between items-center gap-4 pt-1">
                  <div className="flex items-center space-x-1.5 text-xs text-[#ffb2bc] font-semibold">
                    <Timer size={14} className="animate-pulse" />
                    <span className="font-mono">{formatCountdown(product.timeLeft, ticks)} restants</span>
                  </div>
                  
                  <button 
                    onClick={() => onSelectAuction(product)}
                    className="flex items-center justify-center gap-2 bg-[#bb86fc] hover:bg-[#bb86fc]/85 text-[#460283] font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-widest cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(187,134,252,0.2)]"
                  >
                    <Gavel size={13} />
                    <span>Rejoindre la Salle</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </main>

      {/* Menu mobile (Mobile Only) */}
      <nav className="bg-[#1c1b1b]/90 backdrop-blur-md text-[#bb86fc] fixed bottom-0 w-full z-40 rounded-t-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-16 px-4 lg:hidden">
        <button
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform"
        >
          <Compass size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Boutique</span>
        </button>
        <button
          onClick={() => onNavigate('auctions_list')}
          className="flex flex-col items-center justify-center text-[#bb86fc] filter drop-shadow-[0_0_8px_rgba(187,134,252,0.6)] active:scale-105 transition-transform"
        >
          <Timer size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Enchères</span>
        </button>
        <button
          onClick={() => alert("Messagerie (Paul/Nicolas) - Bientôt en ligne")}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform relative"
        >
          <MessageSquare size={18} className="mb-0.5" />
          <span className="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Messagerie</span>
        </button>
        <button
          onClick={() => onLogout()}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-red-400 active:scale-105 transition-transform"
        >
          <LogOut size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Quitter</span>
        </button>
      </nav>

      {/* FOOTER */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Mercato Nova. Tous droits réservés.</p>
          <div className="flex items-center space-x-2 text-[10px] uppercase text-[#ffb2bc]">
            <Shield size={12} />
            <span>Bouclier d'Entiercement Sécurisé du Syndicat</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default AuctionsList;
