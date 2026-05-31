import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal, Wrench, Settings, Compass, Landmark, Check, X,
  Zap, Cpu, ShoppingCart, User, Bell, Heart, LogOut, ChevronRight,
  Info, Gauge, Package, Anchor, Printer, ArrowLeft, ShieldCheck, Flame,
  MessageSquare
} from 'lucide-react';

function Preparation({ user, onLogout, onNavigate }) {
  // Liste des châssis disponibles avec leurs caractéristiques
  const chassisOptions = [
    {
      id: 'r34',
      brand: 'Nissan',
      model: 'Skyline GT-R (R34) - V-Spec II',
      year: 2002,
      baseEngine: 'RB26DETT Twin-Turbo',
      basePower: 280, // ch
      weight: 1560, // kg
      chassisCode: 'BNR34-007821',
      basePrice: 185000, // en Euro
      description: 'La légende suprême de la transmission intégrale ATTESA-ETS Pro et du moteur RB26. Une base idéale pour les préparations extrêmes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYHi8qgkPyuiftrZVdjQQwE4Eh7S158JuDGf2KJyFbAw4_KWz5d4jb56mQAqWwjei9durzUYfFKGEcqwY7tRbAFsG2V9SdRFM8_yOmMtdP-yeB2RSFav-20zapB5A2-eLNo1kVnIqHo-POlbW5KxaxTogcAEnl5734j-HI8ydyidVNsbUvFB2exBJWtgnyc4OqLMPJ3rvxKyXWl7HL8f0q8XDTPtQi4fVT27C-2shtfJlBWkwwnE48FdyHlVzDv4IJCqDPhX9qVpuS'
    },
    {
      id: 'rx7',
      brand: 'Mazda',
      model: 'RX-7 (FD3S) - Spirit R Type A',
      year: 2002,
      baseEngine: '13B-REW Bi-Rotor Rotatif',
      basePower: 280,
      weight: 1270,
      chassisCode: 'FD3S-600482',
      basePrice: 95000,
      description: 'Légèreté absolue et équilibre parfait grâce à son moteur rotatif en position centrale avant. Un comportement routier chirurgical.',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'supra',
      brand: 'Toyota',
      model: 'Supra (JZA80) - RZ Turbo',
      year: 1997,
      baseEngine: '2JZ-GTE Twin-Turbo',
      basePower: 320,
      weight: 1510,
      chassisCode: 'JZA80-004312',
      basePrice: 110000,
      description: 'Le moteur 2JZ indestructible par excellence. Capable d\'encaisser des puissances stratosphériques sur son bloc d\'origine.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDSmJnIPbRjQaMNC1mHAisMSOoLuNqShjOz7DWIKtIg3yh_kD7839JfpBJPcbJfOn5wJi2zX0OolZH1QQMxMgRSNO9_8Vu3NkqQT1eZyvYICQH67HV5W9HT-ADfP83VaY5DX4vhuGqveqbUP_BeFLoYr4nAfh6R2gb_h5zhTMNF2lYv4ovJ7CSVWnlWW87jX_Y7YQfjYpSS6Lk4GmdzIl-alIhGDjNq0zI2tHfz7PtvN7LA-Nw92WC9WMgFmLDnKUBF0w5gWMyD0AP'
    },
    {
      id: 's2k',
      brand: 'Honda',
      model: 'S2000 (AP2) - Type S',
      year: 2008,
      baseEngine: 'F22C1 VTEC Atmosphérique',
      basePower: 240,
      weight: 1250,
      chassisCode: 'AP2-110452',
      basePrice: 45000,
      description: 'Le hurlement légendaire du VTEC à haut régime associé à un châssis monocoque rigide en X. La pureté absolue de la propulsion.',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Liste des Stages de Performance
  const stageOptions = [
    {
      level: 1,
      title: 'STAGE 1',
      subtitle: 'Street Tune',
      powerGain: 40,
      cost: 800,
      details: 'Reprogrammation ECU sur banc, filtre à air sport, bougies froides haute performance. Fiabilité d\'origine préservée.',
      glowColor: 'shadow-[0_0_15px_rgba(187,134,252,0.25)] border-[#bb86fc]'
    },
    {
      level: 2,
      title: 'STAGE 2',
      subtitle: 'Bolt-On Aggressive',
      powerGain: 90,
      cost: 2000,
      details: 'Ligne d\'échappement haute performance, admission carbone scellée, échangeur majoré et cartographie sur mesure.',
      glowColor: 'shadow-[0_0_20px_rgba(187,134,252,0.4)] border-[#bb86fc]'
    },
    {
      level: 3,
      title: 'STAGE 3',
      subtitle: 'Track Spec',
      powerGain: 200,
      cost: 4500,
      details: 'Turbocompresseur renforcé sur roulements, injecteurs gros débit, pompe à carburant haut débit et embrayage renforcé.',
      glowColor: 'shadow-[0_0_20px_rgba(23,222,202,0.35)] border-[#17deca]'
    },
    {
      level: 4,
      title: 'STAGE 4',
      subtitle: 'Time Attack',
      powerGain: 400,
      cost: 9500,
      details: 'Bloc moteur forgé complet (bielles/pistons H-beam), arbres à cames agressifs, conversion gros turbo simple et gestion Flexfuel.',
      glowColor: 'shadow-[0_0_25px_rgba(255,178,188,0.4)] border-[#ffb2bc]'
    }
  ];

  // Pièces matérielles disponibles (Bento Grid)
  const hardwareItems = {
    engine: [
      { id: 'turbo_garrett', name: 'Turbocompresseur Garrett G30-770', price: 2850, specs: 'Twin-scroll, Carter de turbine A/R 1.01', category: 'engine' },
      { id: 'intake_hks', name: 'Admission Carbone HKS Premium', price: 650, specs: 'Boîte à air carbone scellée, filtre mousse', category: 'engine' },
      { id: 'intercooler_hks', name: 'Échangeur R-Type HKS majoré', price: 1250, specs: 'Core épais 100mm, piping aluminium', category: 'engine' }
    ],
    chassis: [
      { id: 'coilovers_tein', name: 'Combinés Filetés Tein Mono Sport', price: 1650, specs: 'Ajustement dureté 16 niveaux, compatible EDFC', category: 'chassis' },
      { id: 'strut_cusco', name: 'Barres Anti-Rapprochement Cusco OS', price: 350, specs: 'Aluminium aéronautique ovale, avant & arrière', category: 'chassis' },
      { id: 'brakes_brembo', name: 'Kit Freins Brembo GT 6-Pistons', price: 3400, specs: 'Disques rainurés flottants 355mm, plaquettes HP', category: 'chassis' }
    ],
    aero: [
      { id: 'widebody_bunny', name: 'Kit Large Rocket Bunny Widebody V2', price: 4850, specs: 'Fibres composites haute densité (FRP), élargi +50mm', category: 'aero' },
      { id: 'wing_voltex', name: 'Aileron Voltex Type 7 GT Carbone', price: 1950, specs: 'Dry Carbon ultra-léger, largeur 1700mm', category: 'aero' },
      { id: 'wheels_rays', name: 'Jantes RAYS Volk Racing TE37 Saga', price: 3600, specs: 'Monobloc forgé haute résistance, 18x9.5J', category: 'aero' }
    ],
    cabin: [
      { id: 'seat_bride', name: 'Sièges Baquets Bride Zeta IV (Set)', price: 1400, specs: 'Coque argent FRP homologuée FIA, tissu rouge signature', category: 'cabin' },
      { id: 'wheel_nardi', name: 'Volant Nardi Deep Corn + Hub Rapide', price: 550, specs: 'Cuir perforé 330mm, moyeu démontable Work Bell', category: 'cabin' },
      { id: 'cage_cusco', name: 'Arceau Cusco Safety 21 (6-Points)', price: 1150, specs: 'Acier carbone étiré à froid, renforts latéraux', category: 'cabin' }
    ]
  };

  // États de l'interface
  const [selectedChassis, setSelectedChassis] = useState(chassisOptions[0]);
  const [selectedStage, setSelectedStage] = useState(stageOptions[0]);
  const [selectedHardware, setSelectedHardware] = useState([
    'turbo_garrett', 'coilovers_tein', 'wheels_rays', 'seat_bride'
  ]); // Pièces actives par défaut
  
  // États d'en-tête (notifications, messages, panier, profil)
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);
  
  // Modal de validation de la commande
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Notifications simulées
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Enchère Skyline R34 dépassée par takumi_86", time: "Il y a 10 min", read: false },
    { id: 2, text: "Nouveau message de Keiichi Tsuchiya", time: "Il y a 2 heures", read: false },
    { id: 3, text: "Entiercement validé pour Jantes GP 18\"", time: "Hier", read: true }
  ]);

  // Messages simulés
  const [messages, setMessages] = useState([
    { id: 1, sender: "Takumi Fujiwara", snippet: "Le turbo HKS est encore dispo ?", time: "18:42", online: true },
    { id: 2, sender: "Keiichi Tsuchiya", snippet: "Je pose une offre sur ta R34.", time: "15:20", online: false }
  ]);

  // Gérer le clic sur une case à cocher Bento
  const toggleHardwareItem = (itemId) => {
    if (selectedHardware.includes(itemId)) {
      setSelectedHardware(prev => prev.filter(id => id !== itemId));
    } else {
      setSelectedHardware(prev => [...prev, itemId]);
    }
  };

  // Trouver un objet matériel par son ID
  const findHardwareItem = (itemId) => {
    for (const cat in hardwareItems) {
      const match = hardwareItems[cat].find(i => i.id === itemId);
      if (match) return match;
    }
    return null;
  };

  // Calcul du coût total
  const chassisCost = selectedChassis.basePrice;
  const stageLaborCost = selectedStage.cost;
  
  const hardwareCost = selectedHardware.reduce((sum, itemId) => {
    const item = findHardwareItem(itemId);
    return sum + (item ? item.price : 0);
  }, 0);

  const logisticsEstimate = 1200; // Flat-rate Euro estimation
  const totalEstimate = chassisCost + stageLaborCost + hardwareCost + logisticsEstimate;

  const handleReadNotification = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  // Empêcher le défilement de l'arrière-plan lorsque la modal est ouverte
  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showConfirmModal]);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] antialiased overflow-x-hidden font-sans pt-24 selection:bg-primary selection:text-[#460283]">
      
      {/* Gradients lumineux néons en arrière-plan */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[50vw] rounded-full bg-[#17deca]/5 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSIvPjwvc3ZnPg==')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Barre de Navigation (Unifiée pour tout le site) */}
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
              className="text-[#cdc3d4] hover:text-[#e5e2e1] px-3 py-2 rounded hover:bg-white/5 transition-all duration-200 cursor-pointer font-semibold text-sm bg-transparent border-none"
            >
              Enchères
            </button>
            <button 
              className="text-[#bb86fc] border-b-2 border-[#bb86fc] pb-1 cursor-pointer transition-colors font-semibold text-sm bg-transparent border-none"
            >
              Préparations
            </button>
          </div>

          {/* Icônes d'action & Profil */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotificationsMenu(!showNotificationsMenu); setShowMessagesMenu(false); setShowProfileMenu(false); }}
                className={`p-2 rounded-full transition-all relative active:scale-95 cursor-pointer ${
                  showNotificationsMenu ? 'text-[#bb86fc] bg-white/5' : 'text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5'
                }`}
                title="Notifications"
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

            {/* Messagerie */}
            <div className="relative">
              <button 
                onClick={() => onNavigate('messages')}
                className="p-2 rounded-full transition-all relative active:scale-95 cursor-pointer text-[#cdc3d4] hover:text-[#bb86fc] hover:bg-white/5"
                title="Messages"
              >
                <MessageSquare size={20} />
              </button>
            </div>

            {/* Profil & Déconnexion */}
            <div className="relative">
              <button 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotificationsMenu(false); setShowMessagesMenu(false); }}
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
                      onClick={() => { setShowProfileMenu(false); onNavigate('account'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-left cursor-pointer"
                    >
                      <User size={14} className="text-[#bb86fc]" />
                      <span>Mon compte</span>
                    </button>
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
      </nav>

      {/* Zone de contenu principal */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-16 py-8">
        
        {/* En-tête de la page */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 text-[#bb86fc] font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <SlidersHorizontal size={14} />
              <span>Configuration JDM haut de gamme</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight italic uppercase text-white">
              Studio de <span className="text-[#17deca]">Préparation</span>
            </h2>
            <p className="text-sm text-[#cdc3d4]/70 max-w-3xl mt-2 font-sans leading-relaxed">
              Sélectionnez votre plateforme de châssis légendaire JDM, calibrez le niveau de performance mécanique requis (Stage) et allouez le matériel haute performance. Notre studio s'occupe du reste.
            </p>
          </div>
          <div className="flex items-center space-x-2.5 text-[#17deca] font-mono text-xs bg-[#17deca]/5 px-4 py-2 rounded-full border border-[#17deca]/20 shadow-[0_0_12px_rgba(23,222,202,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#17deca] animate-pulse"></span>
            <span>Studio Virtuel Connecté</span>
          </div>
        </div>

        {/* Grille principale en 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonne gauche (8 cols) : Sélection des configurations */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1 : Sélecteur de Plateforme Véhicule */}
            <section className="bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#bb86fc]/5 rounded-bl-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center font-mono uppercase tracking-wide">
                  <Wrench className="mr-3 text-[#bb86fc]" size={18} />
                  1. Châssis & Plateforme
                </h3>
                <span className="font-mono text-[9px] text-[#ffb2bc] px-2.5 py-1 bg-[#ffb2bc]/10 rounded-full border border-[#ffb2bc]/25 font-bold uppercase tracking-wider">Requis</span>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-xs text-[#cdc3d4]/50 uppercase tracking-widest mb-3.5">Rechercher ou sélectionner le modèle</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-[#131313] border border-white/10 text-white rounded-xl py-4 pl-4 pr-10 font-medium focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc] transition-all cursor-pointer text-sm shadow-inner"
                      value={selectedChassis.id}
                      onChange={(e) => {
                        const matched = chassisOptions.find(c => c.id === e.target.value);
                        if (matched) setSelectedChassis(matched);
                      }}
                    >
                      {chassisOptions.map(option => (
                        <option key={option.id} value={option.id}>{option.brand} {option.model} ({option.year})</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#cdc3d4]/50">
                      <ChevronRight className="rotate-90" size={18} />
                    </div>
                  </div>
                </div>

                {/* Fiche technique JDM interactive de la voiture sélectionnée */}
                <div className="bg-[#131313]/90 border border-white/5 rounded-xl p-5 flex flex-col md:flex-row gap-6 relative group/card transition-all duration-300 hover:border-white/10">
                  {/* Miniature du bolide */}
                  <div className="w-full md:w-1/3 h-36 rounded-lg overflow-hidden border border-white/10 relative">
                    <img 
                      src={selectedChassis.image} 
                      alt={selectedChassis.model}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2.5 left-3 font-mono text-[9px] px-2 py-0.5 rounded bg-black/60 border border-white/10 uppercase tracking-widest text-[#bb86fc]">
                      {selectedChassis.chassisCode}
                    </div>
                  </div>

                  {/* Caractéristiques JDM */}
                  <div className="flex-1 space-y-3.5">
                    <div>
                      <h4 className="text-base font-bold text-white italic tracking-wide">{selectedChassis.brand} {selectedChassis.model}</h4>
                      <p className="text-xs text-[#cdc3d4]/60 font-sans mt-1 leading-relaxed">{selectedChassis.description}</p>
                    </div>

                    {/* Stats techniques monospaced */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3 text-[11px] font-mono text-[#cdc3d4]/80">
                      <div className="flex items-center gap-2">
                        <Cpu size={12} className="text-[#17deca]" />
                        <span>Moteur : <strong className="text-white">{selectedChassis.baseEngine}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge size={12} className="text-[#17deca]" />
                        <span>Puissance : <strong className="text-white">{selectedChassis.basePower} ch</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={12} className="text-[#17deca]" />
                        <span>Poids : <strong className="text-white">{selectedChassis.weight} kg</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Landmark size={12} className="text-[#17deca]" />
                        <span>Base Châssis : <strong className="text-white">{selectedChassis.basePrice.toLocaleString()} €</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Section 2 : Stages de Performance */}
            <section className="bg-[#1c1b1b]/80 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
              <div className="mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center font-mono uppercase tracking-wide">
                  <Flame className="mr-3 text-[#17deca]" size={18} />
                  2. Niveau de Calibration (Performance Stage)
                </h3>
                <p className="text-xs text-[#cdc3d4]/50 font-sans mt-1">Sélectionnez le niveau d'agressivité de la cartographie et du bloc matériel.</p>
              </div>

              {/* Liste des cartes de stages interactives */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {stageOptions.map(stage => {
                  const isSelected = selectedStage.level === stage.level;
                  return (
                    <label 
                      key={stage.level} 
                      className="relative cursor-pointer group active:scale-98 transition-all"
                    >
                      <input 
                        type="radio" 
                        name="stage" 
                        className="peer sr-only"
                        checked={isSelected}
                        onChange={() => setSelectedStage(stage)}
                      />
                      <div className={`h-full border border-white/10 rounded-xl p-4 bg-[#131313] hover:bg-[#1f1e1e] transition-all flex flex-col justify-between min-h-48 ${
                        isSelected ? `${stage.glowColor} bg-[#bb86fc]/5 border-2` : ''
                      }`}>
                        
                        <div>
                          {/* En-tête du stage */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-mono text-xs font-black tracking-widest ${
                              isSelected ? 'text-[#bb86fc]' : 'text-[#cdc3d4]/40'
                            }`}>
                              {stage.title}
                            </span>
                            {isSelected && (
                              <Check size={14} className="text-[#17deca] filter drop-shadow-[0_0_4px_#17deca]" />
                            )}
                          </div>

                          <div className="text-sm font-bold text-white tracking-wide leading-tight mb-2">
                            {stage.subtitle}
                          </div>
                          
                          <p className="text-[10px] text-[#cdc3d4]/50 font-sans leading-relaxed">
                            {stage.details}
                          </p>
                        </div>

                        {/* Pied de carte avec les gains */}
                        <div className="mt-4 border-t border-white/5 pt-2.5">
                          <div className="text-[11px] font-mono text-[#17deca] font-semibold">
                            +{stage.powerGain} ch (ECU & Airflow)
                          </div>
                          <div className="text-[10px] font-mono text-[#cdc3d4]/40 mt-0.5">
                            Frais Labo : {stage.cost.toLocaleString()} €
                          </div>
                        </div>

                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Section 3 : Bento Allocation Matérielle */}
            <section className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center font-mono uppercase tracking-wide">
                  <Package className="mr-3 text-[#ffb2bc]" size={18} />
                  3. Allocation Pièces Haute Performance
                </h3>
                <p className="text-xs text-[#cdc3d4]/50 font-sans mt-1">Cochez les composants spécifiques que notre équipe doit allouer sur le banc.</p>
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 3.1 MOTEUR & INDUCTION */}
                <div className="bg-[#1c1b1b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-t-2 border-t-[#bb86fc]">
                  <h4 className="font-mono text-xs font-bold text-[#bb86fc] tracking-widest flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span>// MOTEUR & ADMISSION</span>
                    <Flame size={14} className="text-[#bb86fc]" />
                  </h4>
                  <div className="space-y-3.5">
                    {hardwareItems.engine.map(item => {
                      const isActive = selectedHardware.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleHardwareItem(item.id)}
                          className={`flex items-start p-3 rounded-lg border border-white/5 bg-[#131313]/50 cursor-pointer transition-all hover:bg-[#1a1919] ${
                            isActive ? 'border-[#bb86fc]/30 bg-[#bb86fc]/5 shadow-[0_0_12px_rgba(187,134,252,0.05)]' : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 mt-1.5 transition-all ${
                            isActive ? 'bg-[#bb86fc] border-[#bb86fc]' : 'border-white/20 bg-black/40'
                          }`}>
                            {isActive && <Check size={10} className="text-[#000] stroke-[4]" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                              <span className="font-mono text-[10px] text-[#cdc3d4]/60 ml-2">{item.price.toLocaleString()} €</span>
                            </div>
                            <span className="block text-[9px] font-mono text-[#cdc3d4]/40 mt-1">{item.specs}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3.2 DYNAMIQUE CHÂSSIS */}
                <div className="bg-[#1c1b1b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-t-2 border-t-[#17deca]">
                  <h4 className="font-mono text-xs font-bold text-[#17deca] tracking-widest flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span>// DYNAMIQUE CHÂSSIS</span>
                    <SlidersHorizontal size={14} className="text-[#17deca]" />
                  </h4>
                  <div className="space-y-3.5">
                    {hardwareItems.chassis.map(item => {
                      const isActive = selectedHardware.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleHardwareItem(item.id)}
                          className={`flex items-start p-3 rounded-lg border border-white/5 bg-[#131313]/50 cursor-pointer transition-all hover:bg-[#1a1919] ${
                            isActive ? 'border-[#17deca]/30 bg-[#17deca]/5 shadow-[0_0_12px_rgba(23,222,202,0.05)]' : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 mt-1.5 transition-all ${
                            isActive ? 'bg-[#17deca] border-[#17deca]' : 'border-white/20 bg-black/40'
                          }`}>
                            {isActive && <Check size={10} className="text-[#000] stroke-[4]" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                              <span className="font-mono text-[10px] text-[#cdc3d4]/60 ml-2">{item.price.toLocaleString()} €</span>
                            </div>
                            <span className="block text-[9px] font-mono text-[#cdc3d4]/40 mt-1">{item.specs}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3.3 AÉRO & ESTHÉTIQUE */}
                <div className="bg-[#1c1b1b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-t-2 border-t-[#ffb2bc]">
                  <h4 className="font-mono text-xs font-bold text-[#ffb2bc] tracking-widest flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span>// AÉRO & EXTÉRIEUR</span>
                    <Compass size={14} className="text-[#ffb2bc]" />
                  </h4>
                  <div className="space-y-3.5">
                    {hardwareItems.aero.map(item => {
                      const isActive = selectedHardware.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleHardwareItem(item.id)}
                          className={`flex items-start p-3 rounded-lg border border-white/5 bg-[#131313]/50 cursor-pointer transition-all hover:bg-[#1a1919] ${
                            isActive ? 'border-[#ffb2bc]/30 bg-[#ffb2bc]/5 shadow-[0_0_12px_rgba(255,178,188,0.05)]' : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 mt-1.5 transition-all ${
                            isActive ? 'bg-[#ffb2bc] border-[#ffb2bc]' : 'border-white/20 bg-black/40'
                          }`}>
                            {isActive && <Check size={10} className="text-[#000] stroke-[4]" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                              <span className="font-mono text-[10px] text-[#cdc3d4]/60 ml-2">{item.price.toLocaleString()} €</span>
                            </div>
                            <span className="block text-[9px] font-mono text-[#cdc3d4]/40 mt-1">{item.specs}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3.4 CABINE & SÉCURITÉ */}
                <div className="bg-[#1c1b1b]/80 border border-white/10 rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-t-2 border-t-zinc-400">
                  <h4 className="font-mono text-xs font-bold text-zinc-300 tracking-widest flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                    <span>// CABINE & SÉCURITÉ</span>
                    <Landmark size={14} className="text-zinc-300" />
                  </h4>
                  <div className="space-y-3.5">
                    {hardwareItems.cabin.map(item => {
                      const isActive = selectedHardware.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleHardwareItem(item.id)}
                          className={`flex items-start p-3 rounded-lg border border-white/5 bg-[#131313]/50 cursor-pointer transition-all hover:bg-[#1a1919] ${
                            isActive ? 'border-white/20 bg-white/5 shadow-[0_0_12px_rgba(255,255,255,0.02)]' : ''
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 mt-1.5 transition-all ${
                            isActive ? 'bg-zinc-300 border-zinc-300' : 'border-white/20 bg-black/40'
                          }`}>
                            {isActive && <Check size={10} className="text-[#000] stroke-[4]" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                              <span className="font-mono text-[10px] text-[#cdc3d4]/60 ml-2">{item.price.toLocaleString()} €</span>
                            </div>
                            <span className="block text-[9px] font-mono text-[#cdc3d4]/40 mt-1">{item.specs}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </section>

          </div>

          {/* Colonne droite (4 cols) : Facture, devis et commandes */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 bg-[#1c1b1b]/95 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/80">
              
              {/* En-tête devis */}
              <div className="p-6 border-b border-white/5 bg-[#1c1b1b]/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#bb86fc]/10 to-transparent opacity-50 pointer-events-none"></div>
                <h3 className="text-base font-bold text-white font-mono flex items-center relative z-10 uppercase tracking-wider">
                  <ShoppingCart className="mr-3 text-[#bb86fc]" size={18} />
                  Estimation Projet
                </h3>
                <p className="text-[9px] font-mono text-[#cdc3d4]/40 mt-1 uppercase tracking-widest relative z-10">REF-ESTIMATE: MN-JDM-8821</p>
              </div>

              {/* Ligne par ligne */}
              <div className="p-6 space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto bg-black/20">
                
                {/* 1. Base Châssis */}
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Achat Base Châssis</span>
                    <span className="text-[10px] font-mono text-[#cdc3d4]/50 truncate max-w-44 block mt-0.5" title={selectedChassis.model}>
                      {selectedChassis.brand} {selectedChassis.model}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-white">{chassisCost.toLocaleString()} €</span>
                </div>

                {/* 2. Main d'œuvre Stage */}
                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                  <div>
                    <span className="text-xs font-bold text-white block">Main d'œuvre Labo</span>
                    <span className="text-[10px] font-mono text-[#cdc3d4]/50 block mt-0.5">{selectedStage.title} - {selectedStage.subtitle}</span>
                  </div>
                  <span className="font-mono text-xs text-white">{stageLaborCost.toLocaleString()} €</span>
                </div>

                {/* 3. Matériel alloué */}
                <div className="space-y-2 pb-1 border-b border-white/5">
                  <div className="text-[10px] font-mono text-[#cdc3d4]/40 uppercase tracking-widest">Hardware selectionné ({selectedHardware.length}) :</div>
                  {selectedHardware.map(itemId => {
                    const item = findHardwareItem(itemId);
                    if (!item) return null;
                    return (
                      <div key={item.id} className="flex justify-between text-[11px] font-mono pl-1">
                        <span className="text-[#cdc3d4]/70 truncate max-w-48" title={item.name}>• {item.name}</span>
                        <span className="text-white/90">{item.price.toLocaleString()} €</span>
                      </div>
                    );
                  })}
                  {selectedHardware.length === 0 && (
                    <div className="text-[11px] font-mono text-[#ffb2bc]/60 italic pl-1">Aucune pièce sélectionnée</div>
                  )}
                </div>

                {/* 4. Logistique */}
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <div>
                    <span className="text-xs font-bold text-white block">Transport & Transit</span>
                    <span className="text-[10px] font-mono text-[#cdc3d4]/50 block mt-0.5">Fret Maritime & Douanes (Simulé)</span>
                  </div>
                  <span className="font-mono text-xs text-white">{logisticsEstimate.toLocaleString()} €</span>
                </div>

              </div>

              {/* Récit financier & Boutons de commande */}
              <div className="p-6 bg-[#131313]/90 border-t border-white/10 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs font-bold text-white font-mono uppercase tracking-wide">Grand Total</div>
                  <div className="text-2xl font-black text-[#bb86fc] font-mono tracking-tighter filter drop-shadow-[0_0_12px_rgba(187,134,252,0.2)]">
                    {totalEstimate.toLocaleString()} €
                  </div>
                </div>

                {/* Bouton de confirmation principal */}
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full py-4 bg-[#bb86fc] text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-[#cba2ff] transition-all cursor-pointer shadow-[0_0_20px_rgba(187,134,252,0.3)] active:scale-[0.98] flex items-center justify-center relative overflow-hidden group border-none font-mono"
                >
                  <div className="absolute inset-0 bg-white/20 w-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
                  <Zap size={14} className="mr-2" style={{ fill: '#000' }} />
                  Confirmer la Commande
                </button>

                <p className="font-mono text-[9px] text-[#cdc3d4]/40 text-center mt-3.5 uppercase tracking-wider leading-relaxed">
                  Prix estimé assujetti aux fluctuations JDM. Acompte de 10% requis pour validation de commande.
                </p>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* MODAL DE CONFIRMATION DE COMMANDE PERSONNALISÉE (PAS DE POPUP SYSTEME !) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Arrière-plan flouté de la modal */}
          <div 
            onClick={() => setShowConfirmModal(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-300"
          ></div>
          
          {/* Contenu de la modal cyberpunk */}
          <div className="relative bg-[#1c1b1b] border border-[#bb86fc]/40 rounded-2xl p-6 md:p-8 max-w-xl w-full shadow-[0_0_50px_rgba(187,134,252,0.25)] z-10 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            
            {/* Bouton de fermeture */}
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* En-tête de la modal */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#17deca]/10 border border-[#17deca]/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(23,222,202,0.15)]">
                <ShieldCheck className="text-[#17deca]" size={24} />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-wider text-[#17deca]">
                ORDRE DE PRÉPARATION REÇU
              </h3>
              <p className="text-xs font-mono text-[#cdc3d4]/50 mt-1 uppercase tracking-widest">// DEVIS JDM-8821 ENREGISTRÉ</p>
            </div>

            {/* Corps du reçu */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-4 mb-6 font-mono text-xs">
              
              {/* Récapitulatif du véhicule */}
              <div className="border-b border-white/5 pb-3">
                <div className="text-[10px] text-[#cdc3d4]/40 uppercase tracking-widest mb-1">Plateforme Châssis</div>
                <div className="flex justify-between items-center text-white">
                  <span>{selectedChassis.brand} {selectedChassis.model}</span>
                  <span className="text-[#bb86fc] text-[10px]">{selectedChassis.chassisCode}</span>
                </div>
              </div>

              {/* Récapitulatif du Stage */}
              <div className="border-b border-white/5 pb-3">
                <div className="text-[10px] text-[#cdc3d4]/40 uppercase tracking-widest mb-1">Calibrage Performance</div>
                <div className="flex justify-between items-center text-white">
                  <span>{selectedStage.title} - {selectedStage.subtitle}</span>
                  <span className="text-[#17deca]">+{selectedStage.powerGain} ch</span>
                </div>
              </div>

              {/* Pièces incluses */}
              <div className="border-b border-white/5 pb-3">
                <div className="text-[10px] text-[#cdc3d4]/40 uppercase tracking-widest mb-1">Pièces allouées ({selectedHardware.length})</div>
                <div className="space-y-1 mt-1 max-h-24 overflow-y-auto text-[11px] text-[#cdc3d4]/70">
                  {selectedHardware.map(itemId => {
                    const item = findHardwareItem(itemId);
                    return item ? <div key={item.id} className="truncate">• {item.name}</div> : null;
                  })}
                  {selectedHardware.length === 0 && <div className="italic text-[#ffb2bc]">Aucun composant matériel additionnel</div>}
                </div>
              </div>

              {/* Totaux financiers */}
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between text-[#cdc3d4]/60">
                  <span>Montant Total Estimé</span>
                  <span>{totalEstimate.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-[#17deca] font-bold">
                  <span>Acompte requis (10%)</span>
                  <span>{(totalEstimate * 0.1).toLocaleString()} €</span>
                </div>
              </div>

            </div>

            {/* Prochaine étape */}
            <div className="border border-white/10 bg-white/3 rounded-xl p-4 flex gap-4 items-start mb-6 font-sans">
              <Info className="text-[#bb86fc] shrink-0 mt-0.5" size={18} />
              <div>
                <h5 className="text-xs font-bold text-white">Instructions de Dépôt</h5>
                <p className="text-[11px] text-[#cdc3d4]/70 mt-1 leading-relaxed">
                  Votre acompte de <strong className="text-white">{(totalEstimate * 0.1).toLocaleString()} €</strong> doit être déposé sur notre compte bloqué cryptographique. Notre chef d'atelier vous contactera sur le réseau sécurisé pour planifier l'accueil de votre bolide dans nos locaux à Tokyo.
                </p>
              </div>
            </div>

            {/* Actions modal */}
            <div className="flex gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#131313] text-white border border-white/10 hover:border-white/20 transition-all font-bold text-xs uppercase rounded-xl flex items-center justify-center font-mono cursor-pointer"
              >
                <Printer size={14} className="mr-2" />
                Imprimer Devis
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  const items = [
                    { 
                      name: `Châssis : ${selectedChassis.brand} ${selectedChassis.model}`, 
                      price: selectedChassis.basePrice, 
                      image: selectedChassis.image, 
                      qty: 1 
                    },
                    { 
                      name: `Calibrage : ${selectedStage.title} (${selectedStage.subtitle})`, 
                      price: selectedStage.cost, 
                      qty: 1 
                    },
                    ...selectedHardware.map(id => {
                      const item = findHardwareItem(id);
                      return { 
                        name: `Pièce : ${item ? item.name : id}`, 
                        price: item ? item.price : 0, 
                        qty: 1 
                      };
                    })
                  ];
                  onNavigate('checkout', {
                    type: 'preparation',
                    items: items
                  });
                }}
                className="flex-1 py-3 bg-[#17deca] text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#20ffeb] transition-all flex items-center justify-center font-mono cursor-pointer shadow-[0_0_15px_rgba(23,222,202,0.25)] border-none"
              >
                Finaliser l'Ordre
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Preparation;
