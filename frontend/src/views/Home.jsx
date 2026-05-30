import React, { useState, useEffect } from 'react';
import {
  Search, Bell, MessageSquare, User, Grid, List, Shield,
  ShoppingCart, Timer, SlidersHorizontal, ArrowUpRight,
  Check, X, Zap, Cpu, Compass, Landmark, Heart, LogOut
} from 'lucide-react';

function Home({ user, cartItems, onAddToCart, onRemoveFromCart, onLogout, onSelectAuction, onNavigate }) {
  // Jeu de données des produits traduit en français, en lien avec init.sql
  const initialProducts = [
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
      verified: true
    },
    {
      id: 2,
      brand: 'Toyota',
      model: 'Supra RZ MK4',
      year: 1994,
      price: 95000,
      mileage: 82000,
      chassis: 'JZA80-004561',
      engine: '2JZ-GTE',
      power: '320 ch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSmJnIPbRjQaMNC1mHAisMSOoLuNqShjOz7DWIKtIg3yh_kD7839JfpBJPcbJfOn5wJi2zX0OolZH1QQMxMgRSNO9_8Vu3NkqQT1eZyvYICQH67HV5W9HT-ADfP83VaY5DX4vhuGqveqbUP_BeFLoYr4nAfh6R2gb_h5zhTMNF2lYv4ovJ7CSVWnlWW87jX_Y7YQfjYpSS6Lk4GmdzIl-alIhGDjNq0zI2tHfz7PtvN7LA-Nw92WC9WMgFmLDnKUBF0w5gWMyD0AP',
      category: 'Voitures JDM',
      status: 'Négociation',
      saleType: 'negotiation',
      verified: false
    },
    {
      id: 3,
      brand: 'HKS',
      model: 'Kit Turbine Sport GTIII-RS',
      year: 2024,
      price: 2450,
      chassis: 'Montage : Direct (Bolt-On)',
      engine: 'Moteurs : RB25DET / SR20DET',
      power: 'Cible : Jusqu\'à 450 ch',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFS_XUZxgUN809E7Tkl0nMfYsklWjXQomaFH_9Ehqim3Om8JpnDOo8Ms6GRPKjL7oiIN9Kowkch3-CjgZ-E-5oKxmeVDcHyc7cFJtsANv5KV6JMpeSmZX2T-P_eICndaeXgb1PhgCsIjmLwtzi8zhOMkwsdoIZSGx_pNwEvwwe1NS-iSLURfcT8U497XBOCuA9mg2NBGodYm8SgBO0qFDs1qHGp9IR1LLOMPX1svBVrxS7phBWKfaNiKO-n15c8084RcTvKW-6cUXE',
      category: 'Pièces Performance',
      status: 'Achat Direct',
      saleType: 'direct',
      verified: true
    },
    {
      id: 4,
      brand: 'Mazda',
      model: 'RX-7 FD3S Spirit R Type A',
      year: 2002,
      price: 95000,
      mileage: 56000,
      chassis: 'FD3S-600452',
      engine: '13B-REW Rotatif',
      power: '276 ch',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      category: 'Voitures JDM',
      status: 'Négociation',
      saleType: 'negotiation',
      verified: true
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
      verified: true
    },
    {
      id: 6,
      brand: 'Mugen',
      model: 'Jantes GP 18" Bronze (Set)',
      year: 2023,
      price: 3200,
      chassis: 'Taille : 18x8.5J +45',
      engine: 'Moteurs : Civic Type R FK8/FL5',
      power: 'Poids : 7.8 kg par jante',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
      category: 'Accessoires',
      status: 'Achat Direct',
      saleType: 'direct',
      verified: false
    }
  ];

  // Gestion des états
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Voitures JDM', 'Pièces Performance', 'Accessoires']);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]); // Tableau contenant les IDs des produits favoris
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // Filtre favoris uniquement
  const [salesFilter, setSalesFilter] = useState('all'); // 'all', 'auction', 'negotiation', 'direct'
  
  // États de Panier Premium (consommés par les props)
  const [showCartMenu, setShowCartMenu] = useState(false);

  // États de Profil & Menus Déroulants opaques (pour éviter les overlapping bizarres)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);

  // Données de Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Enchère Skyline R34 dépassée par takumi_86", time: "Il y a 10 min", read: false },
    { id: 2, text: "Nouveau message de Keiichi Tsuchiya", time: "Il y a 2 heures", read: false },
    { id: 3, text: "Entiercement validé pour Jantes GP 18\"", time: "Hier", read: true }
  ]);

  // Données de Messagerie
  const [messages, setMessages] = useState([
    { id: 1, sender: "Takumi Fujiwara", snippet: "Le turbo HKS est encore dispo ?", time: "18:42", online: true },
    { id: 2, sender: "Keiichi Tsuchiya", snippet: "Je pose une offre sur ta R34.", time: "15:20", online: false },
    { id: 3, sender: "Célestin (Admin)", snippet: "Réseau crypté opérationnel.", time: "Hier", online: true }
  ]);



  // Fermer les autres menus lors de l'ouverture d'un nouveau menu
  const toggleNotifications = () => {
    setShowNotificationsMenu(!showNotificationsMenu);
    setShowMessagesMenu(false);
    setShowCartMenu(false);
    setShowProfileMenu(false);
  };

  const toggleMessages = () => {
    setShowMessagesMenu(!showMessagesMenu);
    setShowNotificationsMenu(false);
    setShowCartMenu(false);
    setShowProfileMenu(false);
  };

  const toggleCart = () => {
    setShowCartMenu(!showCartMenu);
    setShowNotificationsMenu(false);
    setShowMessagesMenu(false);
    setShowProfileMenu(false);
  };

  const toggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotificationsMenu(false);
    setShowMessagesMenu(false);
    setShowCartMenu(false);
  };

  // Ajouter / Retirer des favoris
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Clic sur une catégorie
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Clic pastille de marque
  const handleBrandSelect = (brand) => {
    if (selectedBrand === brand) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
    }
  };

  // Filtrage dynamique
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.engine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.chassis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.includes(product.category);
    const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
    const matchesFavorites = showOnlyFavorites ? favorites.includes(product.id) : true;
    const matchesSalesType = salesFilter === 'all' ? true : product.saleType === salesFilter;

    return matchesSearch && matchesCategory && matchesBrand && matchesFavorites && matchesSalesType;
  });



  const handleAddToCart = (product) => {
    onAddToCart(product);
  };

  const handleRemoveFromCart = (productId) => {
    onRemoveFromCart(productId);
  };

  // Action administrative : supprimer un produit de la liste locale
  const handleAdminDelete = (productId, model) => {
    if (window.confirm(`[ADMIN] Confirmer la suppression définitive du produit : ${model} ?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      alert(`Produit ${model} supprimé du catalogue.`);
    }
  };

  const handleReadNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Lancement de l'alerte vendeur à la connexion
  useEffect(() => {
    if (user?.role === 'seller') {
      alert("La page espace vendeur doit être implémentée par Nicolas.");
    }
  }, [user]);

  // Rendu conditionnel si vendeur
  if (user?.role === 'seller') {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
        {/* Gradients lumineux néons en arrière-plan */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#17deca]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

        {/* Navigation Vendeur */}
        <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(23,222,202,0.1)]">
          <div className="flex justify-between items-center h-20 px-4 md:px-16 w-full max-w-[1440px] mx-auto">
            {/* Logo & Titre */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded bg-[#17deca] flex items-center justify-center font-black tracking-tighter text-[#003830] italic text-lg shadow-[0_0_12px_rgba(23,222,202,0.4)]">
                MN
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-wider text-[#dab9ff] italic uppercase">MERCATO <span className="text-[#ffb2bc]">NOVA</span></span>
                <p className="text-[9px] text-[#cdc3d4]/50 font-mono tracking-widest -mt-1 uppercase">Tokyo Underground</p>
              </div>
            </div>

            {/* Onglet vendeur */}
            <div className="hidden lg:flex gap-8 items-center font-semibold text-sm">
              <span className="text-[#17deca] border-b-2 border-[#17deca] pb-1 font-mono uppercase tracking-widest text-xs">Espace Vendeur</span>
            </div>

            {/* Profil */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${
                    showProfileMenu ? 'text-[#17deca] bg-white/5' : 'text-[#cdc3d4] hover:text-[#17deca] hover:bg-white/5'
                  }`}
                >
                  <User size={20} />
                </button>

                {showProfileMenu && (
                  <>
                    <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40">
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                        <span className="block text-[#cdc3d4]/40 font-bold uppercase tracking-wider text-[8px]">Réseau Vendeur</span>
                        <span className="text-zinc-200 truncate block mt-0.5" title={user?.email}>{user?.email}</span>
                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20 text-[8px] font-bold uppercase tracking-wider">
                          <Cpu size={8} /> Vendeur
                        </span>
                      </div>

                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("La page espace vendeur doit être implémentée par Nicolas."); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-tertiary hover:bg-tertiary/5 transition-all text-left cursor-pointer"
                      >
                        <Cpu size={14} className="text-tertiary" />
                        <span>Mon Inventaire</span>
                      </button>

                      <button 
                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut size={14} className="text-zinc-500" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Placeholder */}
        <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 flex items-center justify-center min-h-[60vh] relative z-10">
          <div className="glass-panel w-full max-w-2xl rounded-3xl border border-white/5 p-10 text-center space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            <div className="w-16 h-16 rounded-full bg-[#17deca]/10 border border-[#17deca]/30 text-[#17deca] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(23,222,202,0.15)]">
              <Cpu size={28} className="animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[#17deca] font-mono text-xs uppercase tracking-widest font-bold">Syndicate Vendor Console</span>
              <h2 className="text-2xl sm:text-3xl font-black italic tracking-tighter uppercase text-[#dab9ff]">
                Votre Espace Vendeur
              </h2>
              <p className="text-sm text-[#cdc3d4]/70 max-w-md mx-auto">
                Interface de gestion des stocks, d'ajout de bolides JDM et de suivi des enchères en cours.
              </p>
            </div>

            {/* Avertissement de développement */}
            <div className="bg-[#17deca]/5 border border-[#17deca]/20 rounded-xl p-5 max-w-lg mx-auto text-left font-mono text-xs space-y-2 text-[#17deca]">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                <Shield size={14} />
                <span>Message du Système</span>
              </div>
              <p className="text-[#cdc3d4]/80 leading-relaxed text-[11px]">
                Ce module de vente crypté (ajout de voitures en base de données, validation d'offres) doit être implémenté par <strong>Nicolas</strong> lors de la prochaine étape d'intégration du backend.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <button 
                onClick={() => alert("La page espace vendeur doit être implémentée par Nicolas.")}
                className="bg-[#17deca] hover:bg-[#17deca]/95 text-[#003830] font-bold text-xs px-6 py-3.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all active:scale-95 shadow-[0_0_15px_rgba(23,222,202,0.3)] font-sans"
              >
                Ajouter un Bolide
              </button>
              <button 
                onClick={onLogout}
                className="bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs px-6 py-3.5 rounded-lg uppercase tracking-wider cursor-pointer border border-white/10 transition-all active:scale-95 font-sans"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </main>

        <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>© 2026 Mercato Nova. Tous droits réservés.</p>
            <div className="flex items-center space-x-2 text-[10px] uppercase text-tertiary">
              <Shield size={12} />
              <span>Bouclier de Vente Vérifié</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">

      {/* Gradients lumineux néons en arrière-plan */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-0 w-[35vw] h-[35vw] rounded-full bg-secondary/5 blur-[120px] pointer-events-none"></div>

      {/* Barre de navigation */}
      <nav className="bg-[#131313]/80 backdrop-blur-xl fixed top-0 w-full z-40 border-b border-white/10 shadow-[0_0_20px_rgba(187,134,252,0.1)]">
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
              onClick={() => setSalesFilter('all')}
              className="text-[#bb86fc] border-b-2 border-[#bb86fc] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Catalogue
            </button>
            <button 
              onClick={() => onNavigate('auctions_list')}
              className="text-[#cdc3d4] hover:text-[#e5e2e1] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Enchères
            </button>
            <button 
              onClick={() => onNavigate('preparation')}
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
                placeholder="Rechercher châssis, moteur, pièces..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex gap-2.5">
              
              {/* Menu Déroulant Notifications */}
              <div className="relative">
                <button 
                  onClick={toggleNotifications}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showNotificationsMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(187,134,252,0.6)]"></span>
                  )}
                </button>

                {showNotificationsMenu && (
                  <>
                    <div onClick={() => setShowNotificationsMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Flux Réseau</span>
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                          className="text-[9px] font-mono text-[#bb86fc] hover:underline font-bold"
                        >
                          Tout lire
                        </button>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => handleReadNotification(n.id)}
                            className={`px-4 py-3 hover:bg-white/5 transition-all relative cursor-pointer ${!n.read ? 'bg-primary/5' : ''}`}
                          >
                            {!n.read && <span className="absolute top-3.5 left-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                            <p className="text-xs text-zinc-200 pl-1">{n.text}</p>
                            <span className="text-[9px] font-mono text-zinc-500 block mt-1 pl-1">{n.time}</span>
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
                  onClick={toggleMessages}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showMessagesMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Messages"
                >
                  <MessageSquare size={20} />
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-secondary"></span>
                </button>

                {showMessagesMenu && (
                  <>
                    <div onClick={() => setShowMessagesMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Messagerie</span>
                        <span className="text-[9px] font-mono text-[#17deca] font-bold">3 Actifs</span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {messages.map(m => (
                          <div 
                            key={m.id} 
                            onClick={() => { setShowMessagesMenu(false); alert(`Discussion ouverte avec ${m.sender} (simulation)`); }} 
                            className="px-4 py-3 hover:bg-white/5 transition-all flex items-start gap-3 cursor-pointer"
                          >
                            <div className="relative flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-[#bb86fc]">
                                {m.sender.split(' ').map(n=>n[0]).join('')}
                              </div>
                              {m.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#17deca] border-2 border-[#1c1b1b]"></span>}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="text-xs font-bold text-zinc-200 truncate">{m.sender}</h4>
                                <span className="text-[9px] font-mono text-zinc-500">{m.time}</span>
                              </div>
                              <p className="text-[11px] text-[#cdc3d4]/70 truncate">{m.snippet}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bouton Favoris Interactif */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${showOnlyFavorites ? 'text-[#ffb2bc] bg-[#ffb2bc]/10 shadow-[0_0_12px_rgba(255,178,188,0.25)]' : 'text-[#cdc3d4] hover:text-[#ffb2bc] hover:bg-white/5'
                  }`}
                title={showOnlyFavorites ? "Afficher tout le catalogue" : "Afficher mes favoris"}
              >
                <Heart size={20} className={showOnlyFavorites ? "fill-[#ffb2bc]" : ""} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ffb2bc] text-[9px] text-[#400013] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Menu Déroulant Panier */}
              <div className="relative">
                <button 
                  onClick={toggleCart}
                  className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                    showCartMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Panier"
                >
                  <ShoppingCart size={20} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-[9px] text-[#400013] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,178,188,0.5)]">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {showCartMenu && (
                  <>
                    <div onClick={() => setShowCartMenu(false)} className="fixed inset-0 z-30"></div>
                    <div className="absolute right-0 mt-3 w-80 rounded-xl border border-white/10 bg-[#1c1b1b] py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <div className="px-4 pb-2 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-[#cdc3d4]/50 uppercase tracking-widest">Panier</span>
                        <span className="text-[9px] font-mono text-zinc-400 font-bold">{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</span>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto mt-1 divide-y divide-white/5">
                        {cartItems.length === 0 ? (
                          <div className="px-4 py-8 text-center space-y-2">
                            <ShoppingCart size={24} className="text-zinc-600 mx-auto" />
                            <p className="text-xs text-zinc-500">Votre panier est vide.</p>
                          </div>
                        ) : (
                          cartItems.map((item, index) => (
                            <div key={index} className="px-4 py-3 hover:bg-white/5 transition-all flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img src={item.image} alt={item.model} className="w-10 h-8 object-cover rounded border border-white/10 flex-shrink-0" />
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-zinc-200 truncate">{item.model}</h4>
                                  <span className="text-[10px] font-mono text-[#bb86fc]">{item.price.toLocaleString()} €</span>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item.id); }}
                                className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                                title="Retirer"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {cartItems.length > 0 && (
                        <div className="px-4 pt-3 border-t border-white/5 mt-2 space-y-2.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-zinc-400">Total :</span>
                            <span className="font-bold text-[#17deca]">{cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString()} €</span>
                          </div>
                          <button 
                            onClick={() => { 
                              setShowCartMenu(false); 
                              onNavigate('checkout', { 
                                type: 'cart', 
                                items: cartItems.map(item => ({ name: `${item.brand} ${item.model}`, price: item.price, image: item.image, qty: 1 }))
                              }); 
                            }}
                            className="w-full bg-[#bb86fc] hover:bg-[#bb86fc]/80 text-[#460283] font-bold text-[10px] font-mono py-2.5 rounded uppercase tracking-wider text-center cursor-pointer transition-colors block"
                          >
                            Passer au paiement
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Menu Profil avec Dropdown - OPAQUE */}
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className={`p-2 rounded-full transition-all active:scale-95 cursor-pointer ${
                    showProfileMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                  }`}
                  title="Mon profil"
                >
                  <User size={20} />
                </button>

                {/* Dropdown Menu de Profil OPAQUE */}
                {showProfileMenu && (
                  <>
                    <div 
                      onClick={() => setShowProfileMenu(false)}
                      className="fixed inset-0 z-30"
                    ></div>
                    
                    <div className="absolute right-0 mt-3 w-52 rounded-xl border border-white/10 bg-[#1c1b1b] py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                      
                      {/* En-tête de Profil Premium */}
                      <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 text-[10px] font-mono">
                        <span className="block text-[#cdc3d4]/40 font-bold uppercase tracking-wider text-[8px]">Réseau Pilote</span>
                        <span className="text-zinc-200 truncate block mt-0.5" title={user?.email}>{user?.email}</span>
                        {user?.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 text-[8px] font-bold uppercase tracking-wider shadow-[0_0_8px_rgba(255,178,188,0.15)]">
                            <Shield size={8} /> Admin VIP
                          </span>
                        ) : user?.role === 'seller' ? (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-tertiary/10 text-tertiary border border-tertiary/20 text-[8px] font-bold uppercase tracking-wider">
                            <Cpu size={8} /> Vendeur
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[8px] font-bold uppercase tracking-wider">
                            <User size={8} /> Client
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("Ouverture de l'espace Mon compte (Célestin / Profil)"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-primary hover:bg-primary/5 transition-all text-left cursor-pointer"
                      >
                        <User size={14} className="text-[#bb86fc]" />
                        <span>Mon compte</span>
                      </button>
                      
                      <button 
                        onClick={() => { setShowProfileMenu(false); alert("Ouverture de l'espace Mes achats (Gabin / Historique)"); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-secondary hover:bg-secondary/5 transition-all text-left cursor-pointer"
                      >
                        <ShoppingCart size={14} className="text-[#ffb2bc]" />
                        <span>Mes achats</span>
                      </button>
                      
                      {/* Cacher l'espace vendeur pour les clients de type buyer */}
                      {user?.role !== 'buyer' && (
                        <button 
                          onClick={() => { setShowProfileMenu(false); alert("La page espace vendeur doit être implémentée par Nicolas."); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-[#cdc3d4] hover:text-[#17deca] hover:bg-[#17deca]/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1 pt-1.5"
                        >
                          <Cpu size={14} className="text-[#17deca]" />
                          <span>Espace vendeur</span>
                        </button>
                      )}

                      {/* Lien Administrateur Conditionnel */}
                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => { setShowProfileMenu(false); alert("Accès à l'Espace d'Administration Système. Bienvenue Gabin !"); }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-secondary hover:bg-secondary/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1 pt-1.5"
                        >
                          <Shield size={14} className="text-secondary" />
                          <span>Console Admin</span>
                        </button>
                      )}

                      {/* Bouton Déconnexion */}
                      <button 
                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer border-t border-white/5 mt-1.5 pt-2"
                      >
                        <LogOut size={14} className="text-zinc-500" />
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

      {/* Zone de contenu principale */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-16 py-8 grid grid-cols-4 lg:grid-cols-12 gap-6">

        {/* Panneau de Filtres Latéral */}
        <aside className="col-span-4 lg:col-span-3 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5">
            <div className="flex items-center space-x-2.5 mb-6">
              <SlidersHorizontal className="text-[#bb86fc]" size={18} />
              <h3 className="font-bold text-base tracking-wide font-sans">Affiner la Recherche</h3>
            </div>

            <div className="space-y-6">

              {/* Choix des Catégories */}
              <div>
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Catégories</h4>
                <ul className="space-y-2.5">
                  {['Voitures JDM', 'Pièces Performance', 'Accessoires'].map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                          className="form-checkbox bg-[#201f1f] border-white/10 text-[#bb86fc] focus:ring-[#bb86fc] rounded cursor-pointer"
                          type="checkbox"
                        />
                        <span className="text-sm text-[#e5e2e1] group-hover:text-[#bb86fc] transition-colors">
                          {cat}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constructeurs JDM */}
              <div className="pt-5 border-t border-white/5">
                <h4 className="text-[11px] font-bold text-[#cdc3d4]/50 uppercase tracking-widest mb-3">Marque / Constructeur</h4>
                <div className="flex flex-wrap gap-2">
                  {['Nissan', 'Toyota', 'Honda', 'Mazda', 'HKS', 'Mugen'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-3.5 py-1.5 rounded-full border transition-all font-mono text-xs cursor-pointer ${selectedBrand === brand
                          ? 'border-[#bb86fc] text-[#bb86fc] bg-[#bb86fc]/10 shadow-[0_0_10px_rgba(187,134,252,0.25)]'
                          : 'border-white/10 text-[#cdc3d4] hover:border-[#bb86fc]/50 hover:text-[#bb86fc]'
                        }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favoris Uniquement */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    checked={showOnlyFavorites}
                    onChange={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className="form-checkbox bg-[#201f1f] border-white/10 text-[#ffb2bc] focus:ring-[#ffb2bc] rounded cursor-pointer"
                    type="checkbox"
                  />
                  <span className="text-sm text-[#e5e2e1] group-hover:text-[#ffb2bc] transition-colors flex items-center gap-1.5">
                    <Heart size={14} className={showOnlyFavorites ? "fill-[#ffb2bc] text-[#ffb2bc]" : "text-[#cdc3d4]"} />
                    Favoris uniquement
                  </span>
                </label>
              </div>

              {/* Bloc de Statut Réseau */}
              <div className="pt-6 border-t border-white/5 bg-[#1c1b1b]/30 p-4 rounded-xl">
                <div className="flex items-center space-x-2 text-[#ffb2bc] mb-2">
                  <Zap size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Syndicat Hub</span>
                </div>
                <p className="text-[11px] text-[#cdc3d4]/65 leading-relaxed font-mono">
                  Base de données active (MAMP OK). Flux d'enchères connecté. Système d'entiercement sécurisé.
                </p>
              </div>

            </div>
          </div>
        </aside>

        {/* Grille du Catalogue Produits */}
        <section className="col-span-4 lg:col-span-9 space-y-6">

          {/* Bannière Modérateur Admin */}
          {user?.role === 'admin' && (
            <div className="bg-[#ffb2bc]/5 border border-[#ffb2bc]/20 rounded-xl p-4 flex items-center justify-between font-mono text-xs text-[#ffb2bc] shadow-[0_0_15px_rgba(255,178,188,0.05)] animate-in fade-in duration-300 relative z-10">
              <div className="flex items-center gap-2.5">
                <Shield size={16} />
                <span><strong>Mode Modérateur Actif</strong> — Droits de modération globale et suppression d'annonces activés.</span>
              </div>
              <span className="text-[9px] bg-[#ffb2bc]/10 px-2 py-0.5 rounded uppercase tracking-wider font-bold">Admin Console</span>
            </div>
          )}

          {/* En-tête de section */}
          <div className="flex justify-between items-end border-b border-white/5 pb-4">
            <div>
              <div className="inline-flex items-center space-x-2.5 bg-[#7e273b]/20 border border-[#ffb2bc]/30 px-3 py-1 rounded-full text-xs text-[#ffb2bc] mb-3">
                <Compass size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
                <span>Marché du Syndicat Tokyo Drift</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#e5e2e1] uppercase">
                Performance Légendaire
              </h1>
              <p className="text-xs text-[#cdc3d4] mt-1 font-mono">
                {filteredProducts.length} légendes mécaniques vérifiées sous notre charte.
              </p>
            </div>

            {/* Bascule Grille / Liste */}
            <div className="hidden sm:flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded border cursor-pointer transition-all ${viewMode === 'grid'
                    ? 'glass-panel text-primary border-primary neon-glow-primary'
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                  }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded border cursor-pointer transition-all ${viewMode === 'list'
                    ? 'glass-panel text-primary border-primary neon-glow-primary'
                    : 'glass-panel border-white/15 text-[#cdc3d4] hover:text-[#e5e2e1]'
                  }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* Sélecteur de type de vente (Tabs Horizontaux) */}
          <div className="flex flex-wrap gap-2 p-1 bg-[#1c1b1b]/80 border border-white/5 rounded-xl max-w-2xl">
            {[
              { id: 'all', label: 'Tout afficher', icon: Compass },
              { id: 'auction', label: 'Enchères en direct', icon: Timer },
              { id: 'negotiation', label: 'Négociations', icon: MessageSquare },
              { id: 'direct', label: 'Achat direct', icon: ShoppingCart },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSalesFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${salesFilter === tab.id
                      ? 'bg-[#bb86fc] text-[#460283] shadow-[0_0_12px_rgba(187,134,252,0.3)]'
                      : 'text-[#cdc3d4] hover:text-[#e5e2e1] hover:bg-white/5'
                    }`}
                >
                  <TabIcon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Grille ou Liste de Cartes */}
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "space-y-4"
          }>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`glass-panel rounded-2xl overflow-hidden group hover:neon-glow-primary transition-all duration-300 border border-white/5 flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''
                    }`}
                >
                  {/* Image de la voiture ou pièce */}
                  <div className={`relative overflow-hidden bg-[#2a2a2a] ${viewMode === 'list' ? 'h-48 md:w-72 md:h-full flex-shrink-0' : 'h-56 w-full'
                    }`}>
                    <img
                      alt={product.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      src={product.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent"></div>

                    {/* Bouton de mise en favori flottant */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/20 hover:scale-110 active:scale-95 transition-all text-white cursor-pointer hover:bg-white/10 z-10"
                      title={favorites.includes(product.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart
                        size={14}
                        className={favorites.includes(product.id) ? "fill-[#ffb2bc] text-[#ffb2bc] drop-shadow-[0_0_8px_rgba(255,178,188,0.6)]" : "text-white"}
                      />
                    </button>

                    {/* Tags Flottants */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {product.verified && (
                        <span className="bg-[#bb86fc] text-[#460283] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_8px_rgba(187,134,252,0.4)] flex items-center gap-1">
                          <Check size={9} strokeWidth={3} /> Vérifié
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/10 ${product.saleType === 'auction'
                          ? 'bg-secondary-dark/45 text-[#ffb2bc] border-[#ffb2bc]/30 shadow-[0_0_8px_rgba(255,178,188,0.2)]'
                          : product.saleType === 'negotiation'
                            ? 'bg-tertiary/10 text-tertiary border-tertiary/20 shadow-[0_0_8px_rgba(23,222,202,0.2)]'
                            : 'bg-[#1c1b1b] text-zinc-300 border-zinc-700/50'
                        }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Corps de la Fiche */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[#ffb2bc] text-[10px] font-mono uppercase tracking-widest">{product.brand}</span>
                          <h3 className="font-extrabold text-base md:text-lg group-hover:text-primary transition-colors text-zinc-100">
                            {product.year} {product.model}
                          </h3>
                        </div>
                        {product.category === 'Voitures JDM' && (
                          <div className="text-right">
                            <span className="text-[9px] text-[#cdc3d4]/40 font-mono block">Valeur Actuelle</span>
                            <span className="font-extrabold text-[#bb86fc] tracking-tight font-mono">
                              {product.price.toLocaleString()} €
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Caractéristiques techniques */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 my-4 border-t border-b border-white/5 py-3 font-mono text-[11px] text-[#cdc3d4]/70">
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">CHÂSSIS / GRADE</span>
                          <span className="font-semibold text-zinc-200">{product.chassis}</span>
                        </div>
                        {product.mileage ? (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">KILOMÉTRAGE</span>
                            <span className="font-semibold text-zinc-200">{product.mileage.toLocaleString()} km</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">STATUT</span>
                            <span className="font-semibold text-[#17deca]">{product.status}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">MOTEUR</span>
                          <span className="font-semibold text-zinc-200">{product.engine}</span>
                        </div>
                        <div>
                          <span className="text-[#cdc3d4]/30 block text-[9px] uppercase tracking-wider">PUISSANCE / CIBLE</span>
                          <span className="font-semibold text-zinc-200">{product.power}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bloc d'Actions interactives */}
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex justify-between items-center gap-3 mt-4 pt-1">
                        {product.category !== 'Voitures JDM' ? (
                          <>
                            <div className="font-extrabold text-base md:text-lg text-zinc-100 font-mono">
                              {product.price.toLocaleString()} €
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-white/10 hover:bg-white/20 text-[#e5e2e1] text-xs font-semibold px-4.5 py-2.5 rounded-lg transition-all cursor-pointer active:scale-95"
                            >
                              Ajouter au Panier
                            </button>
                          </>
                        ) : product.status === 'Enchère en Cours' ? (
                          <>
                            <div className="flex items-center space-x-1.5 text-xs text-[#ffb2bc] font-semibold animate-pulse">
                              <Timer size={14} />
                              <span>6j 23h restants</span>
                            </div>
                            <button
                              onClick={() => onSelectAuction(product)}
                              className="neon-border-btn text-xs font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer active:scale-95"
                            >
                              Placer une Offre
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-1.5 text-xs text-[#17deca] font-semibold">
                              <Landmark size={14} />
                              <span>Entiercement Vérifié</span>
                            </div>
                            <button
                              onClick={() => alert(`Négociation ouverte pour la ${product.model}. Une fois le backend connecté par Nicolas, cette action enverra une offre en base.`)}
                              className="bg-white/10 hover:bg-[#ffb2bc]/15 border border-white/10 hover:border-[#ffb2bc]/30 text-[#e5e2e1] text-xs font-bold px-5 py-2.5 rounded-lg uppercase tracking-wider cursor-pointer transition-all active:scale-95"
                            >
                              Négocier le Prix
                            </button>
                          </>
                        )}
                      </div>

                      {/* Bouton de suppression Admin conditionnel */}
                      {user?.role === 'admin' && (
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleAdminDelete(product.id, product.model)}
                            className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-secondary hover:text-red-400 hover:bg-secondary/5 px-2.5 py-1.5 rounded transition-all cursor-pointer"
                          >
                            <X size={12} />
                            <span>Supprimer l'annonce (Admin)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center glass-panel rounded-2xl border border-white/5">
                <p className="text-zinc-500 text-sm font-mono mb-2">Aucun bolide trouvé dans la base.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedBrand(null); setSelectedCategories(['Voitures JDM', 'Pièces Performance', 'Accessoires']); }}
                  className="text-[#bb86fc] text-xs font-semibold hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>

          {/* Pagination Bouton */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center pt-8">
              <button
                onClick={() => alert("Inventaire complet chargé. Gabin ajoutera la pagination lors de l'intégration finale avec Célestin.")}
                className="neon-border-btn text-xs font-bold px-8 py-3 rounded-full uppercase tracking-widest text-[#e5e2e1] hover:text-[#bb86fc] cursor-pointer active:scale-95"
              >
                Charger plus de Véhicules
              </button>
            </div>
          )}
        </section>
      </main>



      {/* Menu mobile (Mobile Only) */}
      <nav className="bg-[#1c1b1b]/90 backdrop-blur-md text-[#bb86fc] fixed bottom-0 w-full z-40 rounded-t-2xl border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] flex justify-around items-center h-16 px-4 lg:hidden">
        <button
          onClick={() => { setSelectedCategories(['Voitures JDM', 'Pièces Performance', 'Accessoires']); setSelectedBrand(null); setSalesFilter('all'); }}
          className="flex flex-col items-center justify-center text-[#bb86fc] filter drop-shadow-[0_0_8px_rgba(187,134,252,0.6)] active:scale-105 transition-transform"
        >
          <Compass size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Boutique</span>
        </button>
        <button
          onClick={() => onNavigate('auctions_list')}
          className="flex flex-col items-center justify-center text-[#cdc3d4] hover:text-[#bb86fc] active:scale-105 transition-transform"
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
          title="Se déconnecter"
        >
          <LogOut size={18} className="mb-0.5" />
          <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Quitter</span>
        </button>
      </nav>

      {/* Pied de page */}
      <footer className="bg-[#0e0e0e] border-t border-white/5 py-12 text-[#cdc3d4]/40 text-xs font-mono">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p>© 2026 Mercato Nova. Tous droits réservés.</p>
          <div className="flex space-x-6 text-[10px] uppercase">
            <span className="hover:text-white cursor-pointer">Conditions d'utilisation</span>
            <span className="hover:text-white cursor-pointer">Protection d'Entiercement</span>
            <span className="hover:text-white cursor-pointer">Statut API</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] uppercase text-[#ffb2bc]">
            <Shield size={12} />
            <span>Bouclier d'Entiercement Sécurisé du Syndicat</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
